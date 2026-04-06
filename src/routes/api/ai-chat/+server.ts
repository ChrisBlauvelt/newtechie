import { streamText } from 'ai';
import { VERCEL_AI_API_KEY } from '$env/static/private';
import { buildSystemPrompt } from '$lib/ai/prompt-builder';
import { KNOWLEDGE_BASE } from '$lib/ai/knowledge-base';
import type { RequestHandler } from './$types';

interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

interface ChatRequest {
	message: string;
	conversationHistory?: ChatMessage[];
}

/**
 * Validates the incoming chat request
 * @param data - Request data to validate
 * @returns Error message if validation fails, null if valid
 */
function validateRequest(data: ChatRequest): string | null {
	const { message } = data;

	// Check if message exists
	if (!message) {
		return 'Message is required';
	}

	// Check if message is a string
	if (typeof message !== 'string') {
		return 'Invalid message format';
	}

	// Check if message is not empty after trimming
	const trimmedMessage = message.trim();
	if (trimmedMessage.length === 0) {
		return 'Message cannot be empty';
	}

	// Check message length limit
	if (trimmedMessage.length > 1000) {
		return 'Message must be 1000 characters or less';
	}

	return null;
}

/**
 * POST handler for AI chat endpoint
 * Accepts a message and optional conversation history, returns a streaming AI response
 */
export const POST: RequestHandler = async ({ request }) => {
	// Check if API key is configured
	if (!VERCEL_AI_API_KEY) {
		console.error('[AI Chat API] Missing VERCEL_AI_API_KEY environment variable');
		return new Response(
			JSON.stringify({ error: 'Service configuration error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	try {
		// Parse request body
		const data: ChatRequest = await request.json();

		// Validate input
		const validationError = validateRequest(data);
		if (validationError) {
			return new Response(
				JSON.stringify({ error: validationError }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Build system prompt with knowledge base context
		const systemPrompt = buildSystemPrompt(KNOWLEDGE_BASE);

		// Prepare messages for the AI SDK
		const messages = [
			...(data.conversationHistory || []).map(msg => ({
				role: msg.role as 'user' | 'assistant',
				content: msg.content
			})),
			{ role: 'user' as const, content: data.message.trim() }
		];

		// Use Vercel AI SDK to stream the response
		const result = await streamText({
			model: 'anthropic/claude-3-5-sonnet-20241022',
			system: systemPrompt,
			messages,
			temperature: 0.7,
			apiKey: VERCEL_AI_API_KEY
		});

		// Convert to text stream and return
		const stream = result.textStream;
		
		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			}
		});

	} catch (error: any) {
		console.error('[AI Chat API] Error processing request:', error);

		// Handle specific error types
		if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
			return new Response(
				JSON.stringify({ error: 'AI service unavailable' }),
				{
					status: 503,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		if (error.status === 429 || error.message?.includes('rate limit')) {
			return new Response(
				JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		if (error.message?.includes('network') || error.code === 'ETIMEDOUT') {
			return new Response(
				JSON.stringify({ error: 'Network error. Please check your connection and try again.' }),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Generic error response
		return new Response(
			JSON.stringify({ error: 'Failed to process request. Please try again.' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
