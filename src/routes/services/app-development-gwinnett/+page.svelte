<script>
  import { onMount } from "svelte";
  import FAQ from "$lib/components/FAQ.svelte";

  onMount(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  });

  const appFaqs = [
    {
      question: "What types of custom applications do you build?",
      answer: "We build everything from client portals and internal dashboards to full-scale SaaS platforms and automated workflow systems. Our custom web applications are built using modern frameworks like SvelteKit, ensuring they are fast, secure, and scalable."
    },
    {
      question: "How much does a custom web application cost in Gwinnett?",
      answer: "The cost depends on the complexity, features, and required integrations. Simple workflow automations or client portals can start at a few thousand dollars, while comprehensive enterprise software solutions are scoped as larger projects. We offer free discovery calls to review your needs and provide accurate estimates."
    },
    {
      question: "Do you maintain the software after it is launched?",
      answer: "Yes, TechieNeighbor provides ongoing maintenance, reliable hosting, and support contracts to ensure your application remains secure, up-to-date, and fully functional as your business scales."
    }
  ];
</script>

<svelte:head>
  <title>Custom App Development Gwinnett County | TechieNeighbor</title>
  <meta
    name="description"
    content="Top-rated custom application development for small businesses in Gwinnett County. We build tailored web apps, automations, and software to grow your business."
  />
  <meta property="og:title" content="Custom App Development Gwinnett County | TechieNeighbor" />
  <meta property="og:description" content="Top-rated custom application development for small businesses in Gwinnett County. We build tailored web apps, automations, and software to grow your business." />
</svelte:head>

<main class="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen pt-24 pb-16">
  <article class="container mx-auto px-4 md:px-6">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter glow-text mb-4">
        Custom Business Applications in Gwinnett
      </h1>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        We specialize in building custom web applications and business automations that off-the-shelf software can't match.
      </p>
    </header>

    <section class="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-bold text-teal-400">Software Built Around Your Business</h2>
        <p class="text-gray-300 text-lg leading-relaxed">
          Off-the-shelf software forces you to change your workflows to match the code. Custom application development means the software is built to perfectly match how your business operates. We serve Metro Atlanta businesses with modern, fast, and scalable solutions.
        </p>
        <ul class="space-y-4 text-gray-300">
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Workflow Automations</strong>
              Save hours of manual data entry every week with custom API integrations.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Client Portals & Dashboards</strong>
              Give your customers a professional, secure way to interact with your business online.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Modern Web Technologies</strong>
              Built with lightning-fast frameworks like SvelteKit for the best performance and SEO.
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-slate-800/50 p-8 rounded-xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
        <h3 class="text-2xl font-bold mb-4">Let's Discuss Your Project</h3>
        <p class="text-gray-300 mb-6">
          Whether you need a full enterprise application or a simple script to connect two software platforms, our local Gwinnett developers are ready to help.
        </p>
        <a href="/#contact" class="inline-block w-full text-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]">
          Schedule a Discovery Call
        </a>
      </div>
    </section>

    <div class="mt-16 border-t border-slate-700 pt-8">
      <FAQ faqs={appFaqs} />
    </div>
  </article>

  <!-- Footer -->
  <footer class="w-full mt-16 py-6 border-t border-slate-700 bg-slate-900/50 text-gray-300">
    <div class="container px-4 md:px-6 mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-teal-500">TechieNeighbor</span>
        </div>
        <div class="flex items-center space-x-4 text-sm">
          <span>© 2026 TechieNeighbor. All rights reserved.</span>
          <a href="/" class="hover:text-teal-400 transition-colors">Home</a>
          <a href="/terms-of-service" class="hover:text-teal-400 transition-colors">Terms</a>
          <a href="/privacy-policy" class="hover:text-teal-400 transition-colors">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</main>
