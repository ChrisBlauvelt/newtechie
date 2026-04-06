import { supabase } from '$lib/supabase';
import type { AuthError, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

// TypeScript interfaces
export interface User {
	id: string;
	email: string;
	role: 'admin';
}

export interface Session {
	access_token: string;
	refresh_token: string;
	expires_at: number;
}

export interface AuthResult {
	success: boolean;
	user?: User;
	session?: Session;
	error?: string;
}

/**
 * Authentication service for admin dashboard
 * Handles login, logout, session verification, and user retrieval
 */
export const authService = {
	/**
	 * Authenticate admin user with email and password
	 * @param email - Admin email address
	 * @param password - Admin password
	 * @returns AuthResult with user and session data on success
	 */
	async login(email: string, password: string): Promise<AuthResult> {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				return {
					success: false,
					error: error.message
				};
			}

			if (!data.user || !data.session) {
				return {
					success: false,
					error: 'Authentication failed'
				};
			}

			// Map Supabase user to our User interface
			const user: User = {
				id: data.user.id,
				email: data.user.email!,
				role: 'admin'
			};

			// Map Supabase session to our Session interface
			const session: Session = {
				access_token: data.session.access_token,
				refresh_token: data.session.refresh_token,
				expires_at: data.session.expires_at || 0
			};

			return {
				success: true,
				user,
				session
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred'
			};
		}
	},

	/**
	 * End admin session
	 * Clears authentication tokens and signs out user
	 */
	async logout(): Promise<void> {
		await supabase.auth.signOut();
	},

	/**
	 * Verify current session is valid
	 * @param token - Access token to verify
	 * @returns true if session is valid, false otherwise
	 */
	async verifySession(token: string): Promise<boolean> {
		try {
			const { data, error } = await supabase.auth.getUser(token);
			
			if (error || !data.user) {
				return false;
			}

			return true;
		} catch {
			return false;
		}
	},

	/**
	 * Get current authenticated user
	 * @returns User object if authenticated, null otherwise
	 */
	async getCurrentUser(): Promise<User | null> {
		try {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				return null;
			}

			return {
				id: data.user.id,
				email: data.user.email!,
				role: 'admin'
			};
		} catch {
			return null;
		}
	}
};
