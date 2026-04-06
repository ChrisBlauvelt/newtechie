<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  
  export let questions: string[] = [];
  export let onSelect: (question: string) => void;
  export let isVisible: boolean = true;
</script>

{#if isVisible && questions.length > 0}
  <div 
    class="suggested-questions"
    transition:fade={{ duration: 300 }}
    role="group"
    aria-label="Suggested questions"
  >
    {#each questions as question, index (question)}
      <button
        class="question-chip"
        on:click={() => onSelect(question)}
        transition:scale={{ duration: 200, delay: index * 50 }}
        aria-label={`Ask: ${question}`}
      >
        {question}
      </button>
    {/each}
  </div>
{/if}

<style>
  .suggested-questions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .question-chip {
    padding: 0.75rem 1rem;
    background: rgba(20, 184, 166, 0.1);
    border: 1px solid rgba(20, 184, 166, 0.3);
    border-radius: 0.75rem;
    color: #0d9488;
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .question-chip:hover {
    background: rgba(20, 184, 166, 0.2);
    border-color: rgba(20, 184, 166, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.15);
  }

  .question-chip:focus {
    outline: 2px solid #14b8a6;
    outline-offset: 2px;
    background: rgba(20, 184, 166, 0.2);
  }

  .question-chip:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(20, 184, 166, 0.1);
  }

  @media (max-width: 768px) {
    .question-chip {
      font-size: 0.8125rem;
      padding: 0.625rem 0.875rem;
    }
  }
</style>
