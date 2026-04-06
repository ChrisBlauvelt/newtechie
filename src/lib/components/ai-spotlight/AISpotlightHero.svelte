<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ChatMessage from './ChatMessage.svelte';
	import SuggestedQuestions from './SuggestedQuestions.svelte';

	// Type definitions
	interface ChatMessage {
		id: string;
		role: 'user' | 'assistant' | 'system';
		content: string;
		timestamp: Date;
	}

	// Component state
	let messages: ChatMessage[] = [];
	let isLoading = false;
	let error: string | null = null;
	let inputValue = '';

	// Suggested questions
	const suggestedQuestions = [
		'How can local AI document processing help my small business?',
		'How can a modern website with integrated analytics help our marketing team gain insight?',
		'What smart home automation services do you offer in Gwinnett County?'
	];

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
		messages = [welcomeMessage];
	});

	function addMessage(role: 'user' | 'assistant', content: string): void {
		const newMessage: ChatMessage = {
			id: `${role}-${Date.now()}-${Math.random()}`,
			role,
			content,
			timestamp: new Date()
		};
		messages = [...messages, newMessage];
	}

	function selectSuggestedQuestion(question: string): void {
		showSuggestedQuestions = false;
		inputValue = question;
		sendMessage();
	}

	async function sendMessage(): Promise<void> {
		const message = inputValue.trim();
		
		if (!message) return;
		
		showSuggestedQuestions = false;
		addMessage('user', message);
		
		inputValue = '';
		isLoading = true;
		error = null;
		
		const assistantMessageId = `assistant-${Date.now()}-${Math.random()}`;
		let assistantContent = '';
		
		try {
			const conversationHistory = messages
				.filter(msg => msg.id !== 'welcome')
				.map(msg => ({
					role: msg.role,
					content: msg.content
				}));
			
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
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
				throw new Error(errorData.error || `HTTP ${response.status}`);
			}
			
			if (!response.body) {
				throw new Error('No response body');
			}
			
			const assistantMessage: ChatMessage = {
				id: assistantMessageId,
				role: 'assistant',
				content: '',
				timestamp: new Date()
			};
			messages = [...messages, assistantMessage];
			
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			
			while (true) {
				const { done, value } = await reader.read();
				
				if (done) break;
				
				const chunk = decoder.decode(value, { stream: true });
				assistantContent += chunk;
				
				messages = messages.map(msg =>
					msg.id === assistantMessageId
						? { ...msg, content: assistantContent }
						: msg
				);
			}
			
		} catch (err: any) {
			console.error('Error sending message:', err);
			
			messages = messages.filter(msg => msg.id !== assistantMessageId);
			
			if (err.message?.includes('rate limit') || err.message?.includes('429')) {
				error = 'Too many requests. Please wait a moment before trying again.';
			} else if (err.message?.includes('network') || err.message?.includes('Failed to fetch')) {
				error = 'Unable to connect. Please check your internet connection.';
			} else if (err.message?.includes('timeout')) {
				error = 'Request timed out. Please try again.';
			} else {
				error = err.message || 'Something went wrong. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="ai-spotlight-hero" transition:fade={{ duration: 300 }}>
	<!-- Header -->
	<div class="chat-header">
		<div class="header-content">
			<div class="sparkle-icon-wrapper">
				<svg
					class="sparkle-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" />
				</svg>
			</div>
			<h3 class="chat-title">Ask About Our Services</h3>
		</div>
	</div>

	<!-- Message Container -->
	<div class="message-container">
		{#each messages as message (message.id)}
			<ChatMessage {message} isStreaming={false} />
		{/each}

		{#if showSuggestedQuestions && messages.length === 1}
			<SuggestedQuestions
				questions={suggestedQuestions}
				onSelect={selectSuggestedQuestion}
				isVisible={true}
			/>
		{/if}

		{#if isLoading}
			<div class="loading-indicator" aria-live="polite" aria-label="Loading response">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
		{/if}

		{#if error}
			<div class="error-message" role="alert" transition:fade>
				{error}
			</div>
		{/if}
	</div>

	<!-- Input Area -->
	<div class="input-area">
		<input
			type="text"
			class="message-input"
			placeholder="Ask me anything..."
			bind:value={inputValue}
			on:keypress={handleKeyPress}
			aria-label="Ask a question"
			disabled={isLoading}
		/>
		<button
			class="send-button"
			on:click={sendMessage}
			disabled={isLoading || !inputValue.trim()}
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

<style>
	.ai-spotlight-hero {
		width: 100%;
		max-width: 500px;
		height: 500px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(20, 184, 166, 0.2);
		border-radius: 1rem;
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: fadeInScale 0.5s ease-out;
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Header */
	.chat-header {
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
		color: white;
		border-bottom: 1px solid rgba(20, 184, 166, 0.3);
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.sparkle-icon-wrapper {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: pulse 2s infinite;
	}

	.sparkle-icon {
		width: 24px;
		height: 24px;
		color: white;
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
		animation: spin 20s linear infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.chat-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
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
		color: #1f2937;
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

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.ai-spotlight-hero {
			max-width: 100%;
			height: 450px;
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
</style>
