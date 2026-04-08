<!-- src/lib/components/portfolio/PortfolioBento.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import BrowserFrame from './BrowserFrame.svelte';

  const sites = [
    {
      url: 'https://thebrunchapothecary.com',
      title: 'Brunch Apothecary',
      description: 'An elegant website showcasing the menu and feel of a cherished Dacula brunch establishment.',
      tags: ['Svelte', 'SvelteKit', 'Responsive'],
      fallbackImage: '/portfolio/brunch-apothecary.webp',
      videoWebm: '/portfolio/brunch-apothecary.webm',
    },
    {
      url: 'https://bagelboyscafe.com',
      title: 'Bagel Boys Cafe',
      description: 'A high-performance modern website for a beloved local bagel shop, featuring a dynamic menu and blazingly fast load times.',
      tags: ['Svelte', 'SvelteKit', 'Blob Storage'],
      fallbackImage: '/portfolio/bagelboyscafe.webp',
      videoWebm: '/portfolio/bagelboyscafe.webm',
    },
    {
      url: 'https://ricosworldkitchen.com',
      title: "Rico's World Kitchen",
      description: 'A modern, responsive website showcasing their menu, location, and story.',
      tags: ['Svelte', 'Tailwind CSS', 'SEO'],
      fallbackImage: '/portfolio/ricos-world-kitchen.webp',
    },
    {
      url: 'https://theartisanagatheringplace.com',
      title: 'The Artisan: A Gathering Place',
      description: 'A dynamic event website with ticket sales, vendor information, and interactive features.',
      tags: ['Svelte', 'Klaviyo Marketing', 'Interactive'],
      fallbackImage: '/portfolio/artisan-gathering.webp',
      videoWebm: '/portfolio/artisan-gathering.webm',
    },
  ];

  let selectedIndex = 0;
  $: selected = sites[selectedIndex];

  let timer;

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      selectedIndex = (selectedIndex + 1) % sites.length;
    }, 10000);
  }

  onMount(() => {
    resetTimer();
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
  <div class="space-y-2">
    <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
      Our Work
    </div>
    <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]">
      Portfolio of Local Business Websites
    </h2>
    <p class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl">
      Explore some of the custom websites I've created for businesses in Gwinnett County and Metro Atlanta.
    </p>
  </div>
</div>

<!-- Portfolio Layout: Site List + Preview -->
<div class="portfolio-layout max-w-6xl mx-auto gap-4">
  <!-- Site List -->
  <div class="site-list flex flex-col gap-2">
    {#each sites as site, i}
      <button
        class="site-item text-left p-4 rounded-lg transition-all duration-200 {selectedIndex === i
          ? 'bg-gray-800 border border-teal-500/50 shadow-lg shadow-teal-500/10'
          : 'bg-gray-900/50 border border-gray-800 hover:bg-gray-800/70 hover:border-gray-700'}"
        on:click={() => { selectedIndex = i; resetTimer(); }}
      >
        <h3 class="font-semibold text-sm md:text-base transition-colors {selectedIndex === i ? 'text-teal-400' : 'text-white'}">
          {site.title}
        </h3>
        <p class="text-gray-400 text-xs md:text-sm mt-1 line-clamp-2">{site.description}</p>
        <div class="flex flex-wrap gap-1 mt-2">
          {#each site.tags as tag}
            <span class="px-1.5 py-0.5 bg-teal-900/50 text-teal-300 text-[10px] md:text-xs rounded">
              {tag}
            </span>
          {/each}
        </div>
      </button>
    {/each}
  </div>

  <!-- Preview -->
  <div class="site-preview">
    {#key selected.url}
      <BrowserFrame {...selected} />
    {/key}
  </div>
</div>

<style>
  .portfolio-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-areas: "list preview";
  }

  .site-list {
    grid-area: list;
  }

  .site-preview {
    grid-area: preview;
  }

  /* Mobile: stack with list below */
  @media (max-width: 767px) {
    .portfolio-layout {
      grid-template-columns: 1fr;
      grid-template-areas:
        "preview"
        "list";
    }
  }
</style>
