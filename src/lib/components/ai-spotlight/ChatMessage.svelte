<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	export let message: {
		id: string;
		role: 'user' | 'assistant' | 'system';
		content: string;
		timestamp: Date;
	};
	export let isStreaming: boolean = false;

	let renderedContent: string = '';

	// Configure marked for safe rendering
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	// Render markdown for AI messages, plain text for user messages
	$: {
		if (message.role === 'assistant') {
			renderedContent = marked.parse(message.content) as string;
		} else {
			renderedContent = message.content;
		}
	}

	// Format timestamp
	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);

		if (minutes < 1) return 'Just now';
		if (minutes === 1) return '1 minute ago';
		if (minutes < 60) return `${minutes} minutes ago`;

		const hours = Math.floor(minutes / 60);
		if (hours === 1) return '1 hour ago';
		if (hours < 24) return `${hours} hours ago`;

		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div
	class="message-wrapper {message.role}"
	role="article"
	aria-label="{message.role === 'user' ? 'Your message' : 'AI response'}"
>
	<div class="message-bubble {message.role}">
		{#if message.role === 'assistant'}
			<div class="markdown-content" aria-live="polite">
				{@html renderedContent}
			</div>
		{:else}
			<p>{renderedContent}</p>
		{/if}

		{#if isStreaming}
			<span class="typing-indicator" aria-label="AI is typing">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</span>
		{/if}
	</div>

	<span class="timestamp" aria-label="Message sent {formatTimestamp(message.timestamp)}">
		{formatTimestamp(message.timestamp)}
	</span>
</div>

<style>
	.message-wrapper {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message-wrapper.user {
		align-items: flex-end;
	}

	.message-wrapper.assistant {
		align-items: flex-start;
	}

	.message-bubble {
		max-width: 80%;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		word-wrap: break-word;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.message-bubble.user {
		background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
		color: white;
		border-bottom-right-radius: 0.25rem;
	}

	.message-bubble.assistant {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(20, 184, 166, 0.2);
		color: #1f2937;
		border-bottom-left-radius: 0.25rem;
	}

	.message-bubble p {
		margin: 0;
		line-height: 1.5;
	}

	/* Markdown content styling */
	.markdown-content :global(p) {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
	}

	.markdown-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.markdown-content :global(li) {
		margin: 0.25rem 0;
	}

	.markdown-content :global(code) {
		background: rgba(20, 184, 166, 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.markdown-content :global(pre) {
		background: rgba(20, 184, 166, 0.1);
		padding: 0.75rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0.5rem 0;
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.markdown-content :global(strong) {
		font-weight: 600;
		color: #0d9488;
	}

	.markdown-content :global(a) {
		color: #14b8a6;
		text-decoration: underline;
	}

	.markdown-content :global(a:hover) {
		color: #0d9488;
	}

	/* Typing indicator */
	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		background: #14b8a6;
		border-radius: 50%;
		animation: typing 1.4s infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes typing {
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

	.timestamp {
		font-size: 0.75rem;
		color: #6b7280;
		margin-top: 0.25rem;
		padding: 0 0.5rem;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.message-bubble {
			max-width: 90%;
		}
	}
</style>
