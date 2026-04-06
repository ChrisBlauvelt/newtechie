<script>
  export let faqs = [];

  // Generate JSON-LD Schema for FAQPage
  $: schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  });

  let openIndex = 0;

  function toggle(index) {
    if (openIndex === index) {
      openIndex = -1;
    } else {
      openIndex = index;
    }
  }
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${schema}<\/script>`}
</svelte:head>

<section class="w-full py-12">
  <div class="container mx-auto px-4 md:px-6 max-w-4xl">
    <h2 class="text-3xl font-bold tracking-tighter text-white mb-8 text-center group-hover:text-teal-400 transition-colors">
      Frequently Asked Questions
    </h2>
    <div class="space-y-4">
      {#each faqs as faq, index (index)}
        <div class="border border-teal-500/20 rounded-lg bg-slate-800/50 overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.05)]">
          <button 
            class="w-full text-left px-6 py-4 flex justify-between items-center text-teal-50 font-medium hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            on:click={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span class="text-lg">{faq.question}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 transform transition-transform duration-200 text-teal-400 {openIndex === index ? 'roate-180' : ''}" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              {#if openIndex === index}
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
              {:else}
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              {/if}
            </svg>
          </button>
          
          {#if openIndex === index}
            <div class="px-6 pb-4 pt-2 text-gray-300 leading-relaxed">
              {@html faq.answer}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
