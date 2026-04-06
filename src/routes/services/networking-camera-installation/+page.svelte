<script>
  import { onMount } from "svelte";
  import FAQ from "$lib/components/FAQ.svelte";

  onMount(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  });

  const networkFaqs = [
    {
      question: "Do you install security cameras for commercial businesses in Gwinnett?",
      answer: "Yes, we specialize in commercial-grade PoE (Power over Ethernet) security camera installations. We prefer systems like Ubiquiti UniFi Protect, which offer crystal clear 4K resolution, remote mobile access, and local storage without any recurring cloud subscription fees."
    },
    {
      question: "Can you fix my spotty office WiFi?",
      answer: "Absolutely. We perform professional WiFi site surveys to identify dead zones and install enterprise-grade access points. Whether you need coverage for a small retail shop or a large warehouse in Metro Atlanta, we design networks for speed and reliability."
    },
    {
      question: "Do you do structured network cabling?",
      answer: "Yes, we provide professional low-voltage network cabling (Cat6, Cat6a) for new office build-outs, renovations, and warehouse spaces throughout Gwinnett County and Metro Atlanta."
    }
  ];
</script>

<svelte:head>
  <title>Security Camera & Network Installations Gwinnett | TechieNeighbor</title>
  <meta
    name="description"
    content="Professional network cabling, WiFi setups, and security camera installations in Gwinnett County. High-quality Ubiquiti / UniFi setups for businesses."
  />
  <meta property="og:title" content="Security Camera & Network Installations Gwinnett | TechieNeighbor" />
  <meta property="og:description" content="Professional network cabling, WiFi setups, and security camera installations in Gwinnett County. High-quality Ubiquiti / UniFi setups for businesses." />
</svelte:head>

<main class="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen pt-24 pb-16">
  <article class="container mx-auto px-4 md:px-6">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter glow-text mb-4">
        Networking & Security Camera Installs
      </h1>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        Expert structured cabling, enterprise WiFi, and PoE security camera installations across Gwinnett County and Metro Atlanta.
      </p>
    </header>

    <section class="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-bold text-teal-400">Reliable Infrastructure for Your Business</h2>
        <p class="text-gray-300 text-lg leading-relaxed">
          Your business relies on a solid foundation. If your WiFi is spotty or your security cameras are low quality, it impacts your bottom line and peace of mind. We specialize in robust, hardwired solutions that just work.
        </p>
        <ul class="space-y-4 text-gray-300">
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Enterprise WiFi & Networking</strong>
              We install reliable access points, switches, and firewalls using premium gear like Ubiquiti UniFi.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Security Camera Systems (CCTV / PoE)</strong>
              Crystal clear 4K cameras with no monthly cloud fees, giving you full control and remote access.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Smart Home & Business Automation</strong>
              Integrated access control, smart lighting, and automated systems tuned for your environment.
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-slate-800/50 p-8 rounded-xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
        <h3 class="text-2xl font-bold mb-4">Need an On-Site Estimate?</h3>
        <p class="text-gray-300 mb-6">
          We provide free walkthroughs for commercial and residential properties in Gwinnett County to assess your networking and security needs.
        </p>
        <a href="/#contact" class="inline-block w-full text-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]">
          Request an On-Site Walkthrough
        </a>
      </div>
    </section>

    <div class="mt-16 border-t border-slate-700 pt-8">
      <FAQ faqs={networkFaqs} />
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
