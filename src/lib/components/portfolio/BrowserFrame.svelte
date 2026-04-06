<!-- src/lib/components/portfolio/BrowserFrame.svelte -->
<script>
  import { onMount } from 'svelte';

  export let url;
  export let title;
  export let description;
  export let tags = [];
  export let scale = 0.3;

  let iframeLoaded = false;
  let interacting = false;
  let visible = true;
  let containerEl;
  let smallScreen = false;

  // Extract display hostname from URL
  $: displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  onMount(() => {
    // Detect small screens for mobile tap-to-visit fallback
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(max-width: 639px)');
      smallScreen = mql.matches;
      const handler = (e) => { smallScreen = e.matches; };
      mql.addEventListener('change', handler);
      // Clean up listener on destroy
      const cleanupMedia = () => mql.removeEventListener('change', handler);

      // Use IntersectionObserver for lazy loading when available
      if (typeof IntersectionObserver !== 'undefined') {
        visible = false;
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              visible = true;
              observer.disconnect();
            }
          },
          { rootMargin: '200px' }
        );
        observer.observe(containerEl);
        return () => { observer.disconnect(); cleanupMedia(); };
      }

      return cleanupMedia;
    }

    // Use IntersectionObserver for lazy loading when available
    if (typeof IntersectionObserver !== 'undefined') {
      visible = false;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            visible = true;
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(containerEl);
      return () => observer.disconnect();
    }
  });

  function enableInteraction() {
    interacting = true;
  }

  function disableInteraction() {
    interacting = false;
  }

  function handleKeydown(event) {
    if (interacting && event.key === 'Escape') {
      disableInteraction();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="browser-frame group rounded-xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
  bind:this={containerEl}
>
  <!-- Browser Chrome -->
  <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
    <div class="flex gap-1.5">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <div class="flex-1 mx-2 px-3 py-1 bg-gray-700 rounded-md text-gray-300 text-xs truncate font-mono">
      {displayUrl}
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-400 hover:text-teal-400 transition-colors text-xs whitespace-nowrap"
      aria-label="Visit {title}"
    >
      Visit ↗
    </a>
  </div>

  <!-- Iframe Container -->
  <div class="relative overflow-hidden bg-white flex-1" style="height: {800 * scale}px;">
    {#if visible}
      {#if !iframeLoaded}
        <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      {/if}
      <iframe
        src={url}
        title={title}
        class="absolute top-0 left-0 border-0"
        style="width: 1280px; height: 800px; transform: scale({scale}); transform-origin: top left; pointer-events: {interacting ? 'auto' : 'none'};"
        loading="lazy"
        on:load={() => { iframeLoaded = true; }}
      ></iframe>
      {#if !interacting}
        <button
          class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 z-10"
          on:click={() => {
            if (smallScreen) {
              window.open(url, '_blank');
            } else {
              enableInteraction();
            }
          }}
          aria-label={smallScreen ? `Visit ${title}` : `Click to interact with ${title}`}
        >
          <span class="bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            {smallScreen ? 'Tap to visit' : 'Click to interact'}
          </span>
        </button>
      {/if}
      {#if interacting}
        <button
          class="absolute top-2 right-2 z-20 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
          on:click={disableInteraction}
        >
          Exit
        </button>
      {/if}
    {:else}
      <!-- Skeleton placeholder -->
      <div class="absolute inset-0 bg-gray-100 animate-pulse"></div>
    {/if}
  </div>

  <!-- Info Bar -->
  <div class="p-4 bg-gray-900">
    <h3 class="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors mb-1">
      {title}
    </h3>
    <p class="text-gray-400 text-sm mb-3">{description}</p>
    <div class="flex flex-wrap gap-1.5">
      {#each tags as tag}
        <span class="px-2 py-0.5 bg-teal-900/50 text-teal-300 text-xs rounded">
          {tag}
        </span>
      {/each}
    </div>
  </div>
</div>
