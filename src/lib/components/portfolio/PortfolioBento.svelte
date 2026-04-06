<!-- src/lib/components/portfolio/PortfolioBento.svelte -->
<script>
  import BrowserFrame from './BrowserFrame.svelte';

  const sites = [
    {
      url: 'https://bagelboyscafe.com',
      title: 'Bagel Boys Cafe',
      description: 'A high-performance modern website for a beloved local bagel shop, featuring a dynamic menu and blazingly fast load times.',
      tags: ['Svelte', 'SvelteKit', 'Blob Storage'],
    },
    {
      url: 'https://ricosworldkitchen.com',
      title: "Rico's World Kitchen",
      description: 'A modern, responsive website showcasing their menu, location, and story.',
      tags: ['React', 'Tailwind CSS', 'SEO'],
    },
    {
      url: 'https://thebrunchapothecary.com',
      title: 'Brunch Apothecary',
      description: 'An elegant website featuring online ordering and beautiful imagery.',
      tags: ['Next.js', 'React', 'Responsive'],
    },
    {
      url: 'https://theartisanagatheringplace.com',
      title: 'The Artisan: A Gathering Place',
      description: 'A dynamic event website with ticket sales, vendor information, and interactive features.',
      tags: ['Svelte', 'Klaviyo Marketing', 'Interactive'],
    },
  ];
</script>

<div class="flex flex-col items-center justify-center space-y-4 text-center mb-12">
  <div class="space-y-2">
    <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
      Our Work
    </div>
    <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter glow-text">
      Portfolio of Local Business Websites
    </h2>
    <p class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl">
      Explore some of the custom websites I've created for businesses in Gwinnett County and Metro Atlanta.
    </p>
  </div>
</div>

<!-- Bento Grid -->
<div class="bento-grid max-w-6xl mx-auto gap-4">
  <!-- Featured: Bagel Boys (large left) -->
  <div class="bento-featured">
    <BrowserFrame {...sites[0]} scale={0.35} />
  </div>

  <!-- Right column: 3 stacked -->
  <div class="bento-top-right">
    <BrowserFrame {...sites[1]} scale={0.25} />
  </div>
  <div class="bento-mid-right">
    <BrowserFrame {...sites[2]} scale={0.25} />
  </div>
  <div class="bento-bot-right">
    <BrowserFrame {...sites[3]} scale={0.25} />
  </div>
</div>

<style>
  .bento-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
      "featured top-right"
      "featured mid-right"
      "featured bot-right";
  }

  .bento-featured {
    grid-area: featured;
  }
  .bento-top-right {
    grid-area: top-right;
  }
  .bento-mid-right {
    grid-area: mid-right;
  }
  .bento-bot-right {
    grid-area: bot-right;
  }

  /* Mobile: single column */
  @media (max-width: 767px) {
    .bento-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "featured"
        "top-right"
        "mid-right"
        "bot-right";
    }
  }
</style>
