<script lang="ts">
	export let onClick: () => void;
	export let isVisible: boolean = true;
	
	let isHovering = false;
</script>

{#if isVisible}
	<div class="chat-bubble-container">
		<button
			on:click={onClick}
			on:mouseenter={() => isHovering = true}
			on:mouseleave={() => isHovering = false}
			class="chat-bubble"
			class:hovering={isHovering}
			aria-label="Open AI assistant chat"
			title="Ask me about our services"
		>
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
			
			<!-- Floating particles -->
			<div class="particle particle-1"></div>
			<div class="particle particle-2"></div>
			<div class="particle particle-3"></div>
		</button>
	</div>
{/if}

<style>
	.chat-bubble-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 1000;
	}

	.chat-bubble {
		position: relative;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.3));
		backdrop-filter: blur(10px);
		border: 1px solid rgba(20, 184, 166, 0.3);
		box-shadow: 0 8px 32px 0 rgba(20, 184, 166, 0.2);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		animation: pulse 2s infinite, float 3s ease-in-out infinite;
		overflow: visible;
	}

	.chat-bubble:hover {
		background: linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(13, 148, 136, 0.4));
		box-shadow: 0 12px 40px 0 rgba(20, 184, 166, 0.3);
		transform: scale(1.05) translateY(-2px);
		animation: pulse 2s infinite, float 3s ease-in-out infinite, wiggle 0.5s ease-in-out;
	}

	.chat-bubble.hovering .sparkle-icon {
		animation: spin 1s ease-in-out;
	}

	.chat-bubble:active {
		transform: scale(0.95);
	}

	.sparkle-icon {
		width: 32px;
		height: 32px;
		color: #14b8a6;
		filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.5));
		transition: transform 0.3s ease;
	}

	/* Floating particles */
	.particle {
		position: absolute;
		width: 4px;
		height: 4px;
		background: #14b8a6;
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
	}

	.chat-bubble:hover .particle {
		animation: particleFloat 2s ease-out infinite;
	}

	.particle-1 {
		top: 10%;
		left: 20%;
		animation-delay: 0s;
	}

	.particle-2 {
		top: 20%;
		right: 15%;
		animation-delay: 0.3s;
	}

	.particle-3 {
		bottom: 15%;
		left: 15%;
		animation-delay: 0.6s;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 8px 32px 0 rgba(20, 184, 166, 0.2);
		}
		50% {
			box-shadow: 0 8px 32px 0 rgba(20, 184, 166, 0.4), 0 0 0 8px rgba(20, 184, 166, 0.1);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes wiggle {
		0%, 100% {
			transform: rotate(0deg) scale(1.05) translateY(-2px);
		}
		25% {
			transform: rotate(-5deg) scale(1.05) translateY(-2px);
		}
		75% {
			transform: rotate(5deg) scale(1.05) translateY(-2px);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes particleFloat {
		0% {
			opacity: 0;
			transform: translateY(0) scale(0);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-30px) scale(1.5);
		}
	}

	/* Accessibility: Focus styles */
	.chat-bubble:focus {
		outline: 2px solid #14b8a6;
		outline-offset: 2px;
	}

	.chat-bubble:focus:not(:focus-visible) {
		outline: none;
	}

	.chat-bubble:focus-visible {
		outline: 2px solid #14b8a6;
		outline-offset: 2px;
	}

	/* Mobile (<768px) - Standard size */
	@media (max-width: 767px) {
		.chat-bubble-container {
			bottom: 1rem;
			right: 1rem;
		}

		.chat-bubble {
			width: 56px;
			height: 56px;
		}

		.sparkle-icon {
			width: 28px;
			height: 28px;
		}
	}

	/* Tablet (768px-1024px) - Larger bubble, adjusted positioning */
	@media (min-width: 768px) and (max-width: 1024px) {
		.chat-bubble-container {
			bottom: 1.5rem;
			right: 1.5rem;
		}

		.chat-bubble {
			width: 72px;
			height: 72px;
		}

		.sparkle-icon {
			width: 36px;
			height: 36px;
		}
	}

	/* Desktop (>1024px) - Optimal size, fixed position */
	@media (min-width: 1025px) {
		.chat-bubble-container {
			bottom: 2rem;
			right: 2rem;
		}

		.chat-bubble {
			width: 64px;
			height: 64px;
		}

		.sparkle-icon {
			width: 32px;
			height: 32px;
		}
	}
</style>
