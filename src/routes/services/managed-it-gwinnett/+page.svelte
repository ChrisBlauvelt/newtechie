<script>
  import { onMount } from "svelte";
  import FAQ from "$lib/components/FAQ.svelte";

  onMount(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  });

  const itFaqs = [
    {
      question: "What is Managed I.T. and how does it help my business?",
      answer: "Managed I.T. is the proactive outsourcing of your company's technology operations. Instead of waiting for a server to crash or a network to fail, our team actively monitors your systems 24/7 to prevent downtime, manage cybersecurity threats, and provide comprehensive helpdesk support, ultimately saving you money and protecting your data."
    },
    {
      question: "Do you offer cybersecurity protection for small businesses in Gwinnett?",
      answer: "Absolutely. We implement enterprise-grade security tailored to small business budgets. This includes next-generation firewalls, endpoint detection and response (EDR), regular data backups, and employee security training to defend against ransomware and phishing attacks."
    },
    {
      question: "How quickly do you respond to I.T. emergencies?",
      answer: "Because we are locally based in Gwinnett County, our response times are significantly faster than national chains. Remote support requests are usually addressed within minutes, and if an on-site visit is necessary in Metro Atlanta, we can often dispatch a technician the same business day."
    }
  ];
</script>

<svelte:head>
  <title>Managed I.T. Services Gwinnett County | TechieNeighbor</title>
  <meta
    name="description"
    content="Reliable, proactive managed I.T. services for small businesses in Gwinnett County. From helpdesk support to cybersecurity and network management."
  />
  <meta property="og:title" content="Managed I.T. Services Gwinnett County | TechieNeighbor" />
  <meta property="og:description" content="Reliable, proactive managed I.T. services for small businesses in Gwinnett County. From helpdesk support to cybersecurity and network management." />
</svelte:head>

<main class="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen pt-24 pb-16">
  <article class="container mx-auto px-4 md:px-6">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter glow-text mb-4">
        Managed I.T. Services in Gwinnett County
      </h1>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        Empowering local businesses with proactive support, robust cybersecurity, and seamless technology management.
      </p>
    </header>

    <section class="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto items-center">
      <div class="space-y-6">
        <h2 class="text-3xl font-bold text-teal-400">Your Local Technology Partner</h2>
        <p class="text-gray-300 text-lg leading-relaxed">
          At TechieNeighbor, we understand that small businesses in Gwinnett County need reliable I.T. infrastructure to thrive. Instead of waiting for things to break, our managed services take a proactive approach to keep your operations running smoothly.
        </p>
        <ul class="space-y-4 text-gray-300">
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">24/7 Proactive Monitoring</strong>
              We detect and resolve issues before they cause downtime.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Cybersecurity & Data Protection</strong>
              Multi-layered defense strategies to protect your critical business data.
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-teal-500 text-xl font-bold">✓</span>
            <div>
              <strong class="text-white block">Helpdesk Support</strong>
              Friendly, local support directly from Metro Atlanta experts.
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-slate-800/50 p-8 rounded-xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
        <h3 class="text-2xl font-bold mb-4">Why Choose a Local Provider?</h3>
        <p class="text-gray-300 mb-6">
          National chains treat you like a ticket number. We treat you like a neighbor. When you partner with TechieNeighbor for your I.T. needs, you get personalized service tailored to your specific industry and operational goals.
        </p>
        <!-- Use the same get in touch button style -->
        <a href="/#contact" class="inline-block w-full text-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]">
          Get a Free I.T. Assessment
        </a>
      </div>
    </section>

    <div class="mt-16 border-t border-slate-700 pt-8">
      <FAQ faqs={itFaqs} />
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
