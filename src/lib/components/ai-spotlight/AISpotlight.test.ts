import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import AISpotlight from './AISpotlight.svelte';

describe('AISpotlight - sendMessage functionality', () => {
	let mockFetch: any;

	beforeEach(() => {
		// Mock fetch globally
		mockFetch = vi.fn();
		global.fetch = mockFetch;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should send message to API and handle streaming response', async () => {
		// Create a mock streaming response
		const mockStream = new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode('Hello '));
				controller.enqueue(new TextEncoder().encode('from '));
				controller.enqueue(new TextEncoder().encode('AI!'));
				controller.close();
			}
		});

		mockFetch.mockResolvedValue({
			ok: true,
			body: mockStream,
			json: async () => ({})
		});

		const { getByRole, getByPlaceholderText } = render(AISpotlight);

		// Click the chat bubble to expand the interface
		const chatBubble = getByRole('button', { name: /open ai assistant/i });
		await fireEvent.click(chatBubble);

		// Wait for component to expand and input to be available
		await waitFor(() => {
			expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});

		// Type a message
		const input = getByPlaceholderText('Ask me anything...') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test question' } });

		// Click send button
		const sendButton = getByRole('button', { name: /send message/i });
		await fireEvent.click(sendButton);

		// Verify fetch was called with correct parameters
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith('/api/ai-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: expect.stringContaining('Test question')
			});
		});

		// Verify the request body structure
		const callArgs = mockFetch.mock.calls[0];
		const requestBody = JSON.parse(callArgs[1].body);
		expect(requestBody.message).toBe('Test question');
		expect(requestBody.conversationHistory).toBeDefined();
	});

	it('should display error message on network failure', async () => {
		// Mock a network error
		mockFetch.mockRejectedValue(new Error('Failed to fetch'));

		const { getByPlaceholderText, getByRole } = render(AISpotlight);

		// Click the chat bubble to expand the interface
		const chatBubble = getByRole('button', { name: /open ai assistant/i });
		await fireEvent.click(chatBubble);

		// Wait for component to expand and input to be available
		await waitFor(() => {
			expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});

		// Type a message
		const input = getByPlaceholderText('Ask me anything...') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test question' } });

		// Click send button
		const sendButton = getByRole('button', { name: /send message/i });
		await fireEvent.click(sendButton);

		// Verify error message is displayed
		await waitFor(() => {
			const errorElement = document.querySelector('.error-message');
			expect(errorElement).toBeTruthy();
			expect(errorElement?.textContent).toContain('Unable to connect');
		});
	});

	it('should clear input field after sending message', async () => {
		// Create a mock streaming response
		const mockStream = new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode('Response'));
				controller.close();
			}
		});

		mockFetch.mockResolvedValue({
			ok: true,
			body: mockStream,
			json: async () => ({})
		});

		const { getByPlaceholderText, getByRole } = render(AISpotlight);

		// Click the chat bubble to expand the interface
		const chatBubble = getByRole('button', { name: /open ai assistant/i });
		await fireEvent.click(chatBubble);

		// Wait for component to expand and input to be available
		await waitFor(() => {
			expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});

		// Type a message
		const input = getByPlaceholderText('Ask me anything...') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test question' } });
		expect(input.value).toBe('Test question');

		// Click send button
		const sendButton = getByRole('button', { name: /send message/i });
		await fireEvent.click(sendButton);

		// Verify input is cleared
		await waitFor(() => {
			expect(input.value).toBe('');
		});
	});

	it('should display loading indicator during API call', async () => {
		// Create a mock streaming response that takes time
		const mockStream = new ReadableStream({
			async start(controller) {
				await new Promise(resolve => setTimeout(resolve, 100));
				controller.enqueue(new TextEncoder().encode('Response'));
				controller.close();
			}
		});

		mockFetch.mockResolvedValue({
			ok: true,
			body: mockStream,
			json: async () => ({})
		});

		const { getByPlaceholderText, getByRole } = render(AISpotlight);

		// Click the chat bubble to expand the interface
		const chatBubble = getByRole('button', { name: /open ai assistant/i });
		await fireEvent.click(chatBubble);

		// Wait for component to expand and input to be available
		await waitFor(() => {
			expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});

		// Type a message
		const input = getByPlaceholderText('Ask me anything...') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test question' } });

		// Click send button
		const sendButton = getByRole('button', { name: /send message/i });
		await fireEvent.click(sendButton);

		// Verify loading indicator appears
		await waitFor(() => {
			const loadingIndicator = document.querySelector('.loading-indicator');
			expect(loadingIndicator).toBeTruthy();
		});
	});

	it('should handle 429 rate limit error', async () => {
		// Mock a 429 error
		mockFetch.mockResolvedValue({
			ok: false,
			status: 429,
			json: async () => ({ error: 'Too many requests' })
		});

		const { getByPlaceholderText, getByRole } = render(AISpotlight);

		// Click the chat bubble to expand the interface
		const chatBubble = getByRole('button', { name: /open ai assistant/i });
		await fireEvent.click(chatBubble);

		// Wait for component to expand and input to be available
		await waitFor(() => {
			expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});

		// Type a message
		const input = getByPlaceholderText('Ask me anything...') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test question' } });

		// Click send button
		const sendButton = getByRole('button', { name: /send message/i });
		await fireEvent.click(sendButton);

		// Verify rate limit error message is displayed
		await waitFor(() => {
			const errorElement = document.querySelector('.error-message');
			expect(errorElement).toBeTruthy();
			expect(errorElement?.textContent).toContain('Too many requests');
		});
	});
});
