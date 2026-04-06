<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import ChatBubble from './ChatBubble.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import SuggestedQuestions from './SuggestedQuestions.svelte';

	// Type definitions
	interface ChatMessage {
		id: string;
		role: 'user' | 'assistant' | 'system';
		content: string;
		timestamp: Date;
	}

	interface ComponentState {
		isExpanded: boolean;
		messages: ChatMessage[];
		isLoading: boolean;
		error: string | null;
		inputValue: string;
	}

	// Component state
	let state: ComponentState = {
		isExpanded: false,
		messages: [],
		isLoading: false,
		error: null,
		inputValue: ''
	};

	// Suggested questions
	const suggestedQuestions = [
		'How can local AI document processing help my small business?',
		'How can a modern website with integrated analytics help our marketing team gain insight?',
		'What smart home automation services do you offer in Gwinnett County?'
	];

	// Show suggested questions only when chat is first opened and no messages exist
	let showSuggestedQuestions = true;

	// Welcome message
	const welcomeMessage: ChatMessage = {
		id: 'welcome',
		role: 'assistant',
		content:
			"Hi! I'm here to help you learn about TechieNeighbor's services. Ask me anything about web development, AI integrations for my business, hardware questions, or more!",
		timestamp: new Date()
	};

	// Initialize with welcome message
	onMount(() => {
		state.messages = [welcomeMessage];
	});

	/**
	 * Toggle between collapsed bubble and expanded chat interface
	 */
	export function toggleExpanded(): void {
		state.isExpanded = !state.isExpanded;
		
		// If expanding for the first time, ensure welcome message is present
		if (state.isExpanded && state.messages.length === 0) {
			state.messages = [welcomeMessage];
		}
	}

	/**
	 * Add a message to the conversation history
	 */
	function addMessage(role: 'user' | 'assistant', content: string): void {
		const newMessage: ChatMessage = {
			id: `${role}-${Date.now()}-${Math.random()}`,
			role,
			content,
			timestamp: new Date()
		};
		state.messages = [...state.messages, newMessage];
	}

	/**
	 * Handle suggested question selection
	 */
	function selectSuggestedQuestion(question: string): void {
		showSuggestedQuestions = false;
		state.inputValue = question;
		sendMessage();
	}

	/**
	 * Send user message and get AI response
	 */
	async function sendMessage(): Promise<void> {
		const message = state.inputValue.trim();
		
		// Validate input
		if (!message) return;
		
		// Hide suggested questions after first message
		showSuggestedQuestions = false;
		
		// Add user message to history
		addMessage('user', message);
		
		// Clear input and set loading state
		state.inputValue = '';
		state.isLoading = true;
		state.error = null;
		
		// Create a temporary message ID for the streaming response
		const assistantMessageId = `assistant-${Date.now()}-${Math.random()}`;
		let assistantContent = '';
		
		try {
			// Prepare conversation history (exclude welcome message)
			const conversationHistory = state.messages
				.filter(msg => msg.id !== 'welcome')
				.map(msg => ({
					role: msg.role,
					content: msg.content
				}));
			
			// Call API endpoint
			const response = await fetch('/api/ai-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message,
					conversationHistory
				})
			});
			
			// Handle non-OK responses
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
				throw new Error(errorData.error || `HTTP ${response.status}`);
			}
			
			// Check if response body exists
			if (!response.body) {
				throw new Error('No response body');
			}
			
			// Create assistant message that will be updated as stream arrives
			const assistantMessage: ChatMessage = {
				id: assistantMessageId,
				role: 'assistant',
				content: '',
				timestamp: new Date()
			};
			state.messages = [...state.messages, assistantMessage];
			
			// Process streaming response
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			
			while (true) {
				const { done, value } = await reader.read();
				
				if (done) break;
				
				// Decode chunk and append to content
				const chunk = decoder.decode(value, { stream: true });
				assistantContent += chunk;
				
				// Update the assistant message in the messages array
				state.messages = state.messages.map(msg =>
					msg.id === assistantMessageId
						? { ...msg, content: assistantContent }
						: msg
				);
			}
			
		} catch (err: any) {
			console.error('Error sending message:', err);
			
			// Remove the incomplete assistant message if it exists
			state.messages = state.messages.filter(msg => msg.id !== assistantMessageId);
			
			// Set user-friendly error message based on error type
			if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
				state.error = 'Unable to connect. Please check your internet connection.';
			} else if (err.message?.includes('429') || err.message?.includes('Too many requests')) {
				state.error = 'Too many requests. Please wait a moment before trying again.';
			} else if (err.message?.includes('503') || err.message?.includes('unavailable')) {
				state.error = 'AI service is temporarily unavailable. Please try again in a moment.';
			} else if (err.message?.includes('timeout')) {
				state.error = 'The request is taking longer than expected. Please try again.';
			} else {
				state.error = 'Something went wrong. Please try again.';
			}
		} finally {
			state.isLoading = false;
		}
	}

	/**
	 * Handle input keypress (Enter to send)
	 */
	function handleKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	/**
	 * Close the chat interface
	 */
	function closeChat(): void {
		state.isExpanded = false;
	}
</script>

{#if !state.isExpanded}
	<ChatBubble onClick={toggleExpanded} isVisible={true} />
{:else}
	<div class="chat-interface" transition:scale={{ duration: 300 }} role="dialog" aria-label="AI Assistant Chat">
		<!-- Header -->
		<div class="chat-header">
			<h2 class="chat-title">TechieNeighbor AI Assistant</h2>
			<button
				class="close-button"
				on:click={closeChat}
				aria-label="Close chat"
				title="Close chat"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Message Container -->
		<div class="message-container">
			{#each state.messages as message (message.id)}
				<ChatMessage {message} isStreaming={false} />
			{/each}

			{#if showSuggestedQuestions && state.messages.length === 1}
				<SuggestedQuestions
					questions={suggestedQuestions}
					onSelect={selectSuggestedQuestion}
					isVisible={true}
				/>
			{/if}

			{#if state.isLoading}
				<div class="loading-indicator" aria-live="polite" aria-label="Loading response">
					<span class="dot"></span>
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
			{/if}

			{#if state.error}
				<div class="error-message" role="alert" transition:fade>
					{state.error}
				</div>
			{/if}
		</div>

		<!-- Input Area -->
		<div class="input-area">
			<input
				type="text"
				class="message-input"
				placeholder="Ask me anything..."
				bind:value={state.inputValue}
				on:keypress={handleKeyPress}
				aria-label="Ask a question"
				disabled={state.isLoading}
			/>
			<button
				class="send-button"
				on:click={sendMessage}
				disabled={state.isLoading || !state.inputValue.trim()}
				aria-label="Send message"
				title="Send message"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="22" y1="2" x2="11" y2="13" />
					<polygon points="22 2 15 22 11 13 2 9 22 2" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.chat-interface {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 400px;
		max-width: calc(100vw - 4rem);
		height: 600px;
		max-height: calc(100vh - 4rem);
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(20, 184, 166, 0.2);
		border-radius: 1rem;
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 1000;
	}

	/* Header */
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
		color: white;
		border-bottom: 1px solid rgba(20, 184, 166, 0.3);
	}

	.chat-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
	}

	.close-button:hover {
		opacity: 0.8;
	}

	.close-button svg {
		width: 24px;
		height: 24px;
	}

	.close-button:focus {
		outline: 2px solid white;
		outline-offset: 2px;
		border-radius: 0.25rem;
	}

	/* Message Container */
	.message-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Scrollbar styling */
	.message-container::-webkit-scrollbar {
		width: 8px;
	}

	.message-container::-webkit-scrollbar-track {
		background: rgba(20, 184, 166, 0.05);
		border-radius: 4px;
	}

	.message-container::-webkit-scrollbar-thumb {
		background: rgba(20, 184, 166, 0.3);
		border-radius: 4px;
	}

	.message-container::-webkit-scrollbar-thumb:hover {
		background: rgba(20, 184, 166, 0.5);
	}

	/* Loading Indicator */
	.loading-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		justify-content: center;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		background: #14b8a6;
		border-radius: 50%;
		animation: loading 1.4s infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes loading {
		0%,
		60%,
		100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		30% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Error Message */
	.error-message {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}

	/* Input Area */
	.input-area {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid rgba(20, 184, 166, 0.2);
		background: rgba(255, 255, 255, 0.5);
	}

	.message-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(20, 184, 166, 0.3);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		background: white;
		transition: border-color 0.2s ease;
	}

	.message-input:focus {
		outline: none;
		border-color: #14b8a6;
		box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
	}

	.message-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.send-button {
		padding: 0.75rem;
		background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
		border: none;
		border-radius: 0.5rem;
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.send-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
	}

	.send-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.send-button svg {
		width: 20px;
		height: 20px;
	}

	.send-button:focus {
		outline: 2px solid #14b8a6;
		outline-offset: 2px;
	}

	/* Mobile Responsive (<768px) - Full-screen overlay */
	@media (max-width: 767px) {
		.chat-interface {
			bottom: 0;
			right: 0;
			left: 0;
			width: 100%;
			max-width: 100%;
			height: 100vh;
			max-height: 100vh;
			border-radius: 0;
			margin: 0;
		}

		.chat-title {
			font-size: 1rem;
		}

		.message-container {
			padding: 0.75rem;
		}

		.input-area {
			padding: 0.75rem 1rem;
		}
	}

	/* Tablet Responsive (768px-1024px) - Larger bubble, adjusted positioning */
	@media (min-width: 768px) and (max-width: 1024px) {
		.chat-interface {
			width: 450px;
			height: 650px;
			bottom: 1.5rem;
			right: 1.5rem;
			max-width: calc(100vw - 3rem);
			max-height: calc(100vh - 3rem);
		}

		.chat-header {
			padding: 1.25rem 1.5rem;
		}

		.chat-title {
			font-size: 1.25rem;
		}

		.message-container {
			padding: 1.25rem;
		}

		.input-area {
			padding: 1.25rem 1.5rem;
		}

		.message-input {
			font-size: 1rem;
		}
	}

	/* Desktop (>1024px) - Fixed position, optimal size */
	@media (min-width: 1025px) {
		.chat-interface {
			width: 400px;
			height: 600px;
			bottom: 2rem;
			right: 2rem;
		}
	}
</style>
