import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } from '$env/static/private';
import { CAMPFIRE_WEBHOOK_URL } from '$env/static/private';

// Lazy initialization of Resend client to avoid build-time errors
let resend = null;

function getResendClient() {
	if (!resend && RESEND_API_KEY) {
		resend = new Resend(RESEND_API_KEY);
	}
	return resend;
}

/**
 * Formats the email template with user data
 * @param {Object} data - Form data
 * @returns {Object} - Email configuration object
 */
export function _formatEmail(data) {
	const { name, email, message } = data;
	const trimmedName = name.trim();
	const trimmedEmail = email.trim();
	const trimmedMessage = message.trim();

	const htmlBody = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background-color: #14b8a6; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
				.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
				.field { margin-bottom: 15px; }
				.label { font-weight: bold; color: #0d9488; }
				.message-box { background-color: white; padding: 15px; border-left: 4px solid #14b8a6; margin-top: 10px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h2>New Contact Form Submission</h2>
				</div>
				<div class="content">
					<div class="field">
						<span class="label">From:</span> ${trimmedName}
					</div>
					<div class="field">
						<span class="label">Email:</span> ${trimmedEmail}
					</div>
					<div class="field">
						<span class="label">Message:</span>
						<div class="message-box">
							${trimmedMessage.replace(/\n/g, '<br>')}
						</div>
					</div>
				</div>
			</div>
		</body>
		</html>
	`;

	return {
		from: RESEND_FROM_EMAIL || 'noreply@techieneighbor.net',
		to: RESEND_TO_EMAIL || 'contact@techieneighbor.net',
		replyTo: trimmedEmail,
		subject: `Contact Form Submission from ${trimmedName}`,
		html: htmlBody
	};
}

/**
 * Sends form data to Campfire webhook
 * @param {Object} data - Form data
 * @returns {Promise<boolean>} - Success status
 */
async function sendToCampfire(data) {
	if (!CAMPFIRE_WEBHOOK_URL) {
		console.log('[Contact API] Campfire webhook URL not configured, skipping');
		return true; // Not an error, just not configured
	}

	try {
		const { name, email, message } = data;
		
		// Format message for Campfire (plain text, Campfire will handle markdown)
		const campfireMessage = `**New Contact Form Submission**

**From:** ${name.trim()}
**Email:** ${email.trim()}
**Message:**
${message.trim()}`;
		
		// Campfire expects the message as plain body content (like curl -d 'message')
		const response = await fetch(CAMPFIRE_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain'
			},
			body: campfireMessage
		});

		if (!response.ok) {
			console.error(`[Contact API] Campfire webhook failed with status ${response.status}`);
			return false;
		}

		console.log('[Contact API] Successfully sent to Campfire webhook');
		return true;
	} catch (error) {
		console.error('[Contact API] Error sending to Campfire webhook:', error.message);
		return false;
	}
}

/**
 * Validates contact form data
 * @param {Object} data - Form data to validate
 * @returns {string|null} - Error message if validation fails, null if valid
 */
export function _validateFormData(data) {
	const { name, email, message } = data;

	// Check required fields are present
	if (!name || !email || !message) {
		return 'All fields are required';
	}

	// Validate field types
	if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
		return 'Invalid field types';
	}

	// Trim whitespace
	const trimmedName = name.trim();
	const trimmedEmail = email.trim();
	const trimmedMessage = message.trim();

	// Check fields are not empty after trimming
	if (!trimmedName || !trimmedEmail || !trimmedMessage) {
		return 'All fields are required';
	}

	// Validate field lengths
	if (trimmedName.length > 200) {
		return 'Name must be 200 characters or less';
	}

	if (trimmedEmail.length > 200) {
		return 'Email must be 200 characters or less';
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmedEmail)) {
		return 'Please provide a valid email address';
	}

	// Check message is not whitespace-only (already checked with trim above)
	// All validations passed
	return null;
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// Check if API key is configured
	if (!RESEND_API_KEY) {
		console.error('[Contact API] Missing RESEND_API_KEY environment variable');
		return json(
			{
				success: false,
				error: 'Service configuration error'
			},
			{ status: 500 }
		);
	}

	// Get Resend client
	const resendClient = getResendClient();
	if (!resendClient) {
		console.error('[Contact API] Failed to initialize Resend client');
		return json(
			{
				success: false,
				error: 'Service configuration error'
			},
			{ status: 500 }
		);
	}

	try {
		// Parse request body
		const data = await request.json();
		
		// Validate input
		const validationError = _validateFormData(data);
		if (validationError) {
			return json(
				{
					success: false,
					error: validationError
				},
				{ status: 400 }
			);
		}

		// Format and send email
		const emailConfig = _formatEmail(data);
		
		try {
			const result = await resendClient.emails.send(emailConfig);
			
			// Log successful submission
			console.log(`[Contact API] Email sent successfully at ${new Date().toISOString()}`);
			console.log(`[Contact API] Recipient: ${emailConfig.to}, From: ${data.name.trim()} <${data.email.trim()}>`);
			
			// Send to Campfire webhook (non-blocking - don't fail if webhook fails)
			sendToCampfire(data).catch(err => {
				console.error('[Contact API] Campfire webhook error (non-blocking):', err.message);
			});
			
			return json(
				{
					success: true,
					message: 'Message sent successfully'
				},
				{ status: 200 }
			);
		} catch (emailError) {
			// Log the error with timestamp
			console.error(`[Contact API] Email send error at ${new Date().toISOString()}:`, emailError);
			
			// Check for specific error types
			if (emailError.message && emailError.message.includes('rate limit')) {
				console.error('[Contact API] Rate limit exceeded');
				return json(
					{
						success: false,
						error: 'Too many requests. Please try again later.'
					},
					{ status: 429 }
				);
			}
			
			// Check for network errors
			if (emailError.code === 'ENOTFOUND' || emailError.code === 'ECONNREFUSED' || emailError.message?.includes('network')) {
				console.error('[Contact API] Network error occurred');
				return json(
					{
						success: false,
						error: 'Network error. Please check your connection and try again.'
					},
					{ status: 500 }
				);
			}
			
			// Log API-specific errors
			if (emailError.statusCode) {
				console.error(`[Contact API] Resend API error - Status: ${emailError.statusCode}`);
			}
			
			// Generic error response (sanitized - no sensitive data exposed)
			return json(
				{
					success: false,
					error: 'Failed to send message. Please try again.'
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		// Log error with timestamp (ensure no sensitive data is logged)
		console.error(`[Contact API] Error processing request at ${new Date().toISOString()}:`, error.message || error);
		
		return json(
			{
				success: false,
				error: 'Failed to process request'
			},
			{ status: 500 }
		);
	}
}
