<!-- src/lib/components/portfolio/BrowserFrame.svelte -->
<script>
  export let url;
  export let title;
  export let description;
  export let tags = [];
  export let fallbackImage = '';
  export let video = '';
  export let videoWebm = '';

  let videoFailed = false;
  let videoEl;

  function handleVideoError() {
    videoFailed = true;
  }

  function handleVideoMount(node) {
    videoEl = node;
    const playPromise = node.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoFailed = true;
      });
    }
  }

  // Extract display hostname from URL
  $: displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  // Reset videoFailed when the site changes
  $: url, videoFailed = false;
</script>

<div
  class="browser-frame group rounded-xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
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

  <!-- Video Preview -->
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class="relative overflow-hidden bg-gray-900 flex-1 block cursor-pointer"
    aria-label="Visit {title}"
  >
    {#if (video || videoWebm) && !videoFailed}
      <video
        use:handleVideoMount
        loop
        muted
        playsinline
        poster={fallbackImage}
        on:error={handleVideoError}
        class="w-full h-full object-cover object-top"
      >
        {#if videoWebm}
          <source src={videoWebm} type="video/webm" on:error={handleVideoError} />
        {/if}
        {#if video}
          <source src={video} type="video/mp4" on:error={handleVideoError} />
        {/if}
        {#if fallbackImage}
          <img
            src={fallbackImage}
            alt="{title} preview"
            class="w-full h-full object-cover object-top"
          />
        {/if}
      </video>
    {:else if fallbackImage}
      <img
        src={fallbackImage}
        alt="{title} preview"
        class="w-full h-full object-cover object-top"
      />
    {:else}
      <div class="w-full h-full bg-gray-800 flex items-center justify-center min-h-[200px]">
        <span class="text-gray-500 text-sm">Preview coming soon</span>
      </div>
    {/if}
    <!-- Hover overlay -->
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
      <span class="bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Visit site ↗
      </span>
    </div>
  </a>

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
