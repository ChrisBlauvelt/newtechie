<script>
  import { onMount } from 'svelte';
  import { fadeIn, slideIn } from '../../animations';
  import { track } from '@vercel/analytics';
  
  let visibleSections = { header: false, content: false };
  
  onMount(() => {
    // Track page view
    track('Page View', {
      page: 'Terms of Service',
      url: '/terms-of-service'
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          visibleSections[sectionId] = true;
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  });
</script>

<svelte:head>
  <title>Terms of Service | TechieNeighbor</title>
  <meta name="description" content="Terms of Service for TechieNeighbor - Learn the terms and conditions for using our website and services." />
  <link rel="canonical" href="https://techieneighbor.net/terms-of-service" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <header class="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
    <div class="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
      <div class="flex items-center gap-2">
        <a href="/" class="text-lg md:text-xl font-bold text-white hover:text-teal-400 transition-colors">TechieNeighbor</a>
      </div>
      <nav class="hidden md:flex gap-6">
        <a href="/#services" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Terms of Service', link: 'Services' })}>Services</a>
        <a href="/#about" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Terms of Service', link: 'About' })}>About</a>
        <a href="/#portfolio" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Terms of Service', link: 'Portfolio' })}>Portfolio</a>
        <a href="/home-improvement" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Terms of Service', link: 'Home Improvement' })}>Home Improvement</a>
        <a href="/#contact" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Terms of Service', link: 'Contact' })}>Contact</a>
      </nav>
      <a href="tel:470-962-1059" class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors" on:click={() => track('Phone Call Clicked', { page: 'Terms of Service', location: 'header' })}>Get in Touch</a>
    </div>
  </header>
  <main class="flex-1">
    <section id="header" class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.header}
          <div class="max-w-4xl mx-auto text-center" in:fadeIn>
            <div class="space-y-4">
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter glow-text">Terms of Service</h1>
              <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Last updated: June 19, 2025</p>
            </div>
          </div>
        {/if}
      </div>
    </section>
    <section id="content" class="w-full py-8 md:py-12 lg:py-24 bg-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.content}
          <div class="max-w-4xl mx-auto prose prose-lg" in:slideIn={{ direction: 'up' }}>
            <div class="space-y-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Mobile Terms of Service</h2>
                <p class="text-gray-600 leading-relaxed"><strong>Techie Neighbor</strong></p>
                <p class="text-gray-600 leading-relaxed">Last updated: June 19, 2025</p>
                <p class="text-gray-600 leading-relaxed">The Techie Neighbor mobile message service (the "Service") is operated by Techie Neighbor (“Techie Neighbor”, “we”, or “us”). Your use of the Service constitutes your agreement to these terms and conditions (“Mobile Terms”). We may modify or cancel the Service or any of its features without notice. To the extent permitted by applicable law, we may also modify these Mobile Terms at any time and your continued use of the Service following the effective date of any such changes shall constitute your acceptance of such changes.</p>
                <p class="text-gray-600 leading-relaxed">By consenting to Techie Neighbor's SMS/text messaging service, you agree to receive recurring SMS/text messages from and on behalf of Techie Neighbor through your wireless provider to the mobile number you provided, even if your mobile number is registered on any state or federal Do Not Call list. Text messages may be sent using an automatic telephone dialing system or other technology. Promotional messages may include promotions, specials, and other marketing offers (e.g., cart reminders).</p>
                <p class="text-gray-600 leading-relaxed">You understand that you do not have to sign up for this program in order to make any purchases, and your consent is not a condition of any purchase with Techie Neighbor. Your participation in this program is completely voluntary.</p>
                <p class="text-gray-600 leading-relaxed">We do not charge for the Service, but you are responsible for all charges and fees associated with text messaging imposed by your wireless provider. Message frequency varies. Message and data rates may apply. Check your mobile plan and contact your wireless provider for details. You are solely responsible for all charges related to SMS/text messages, including charges from your wireless provider.</p>
                <p class="text-gray-600 leading-relaxed">You may opt-out of the Service at any time. Text the single keyword command STOP to +18774622344 or click the unsubscribe link (where available) in any text message to cancel. You'll receive a one-time opt-out confirmation text message. No further messages will be sent to your mobile device, unless initiated by you. If you have subscribed to other Techie Neighbor mobile message programs and wish to cancel, except where applicable law requires otherwise, you will need to opt out separately from those programs by following the instructions provided in their respective mobile terms.</p>
                <p class="text-gray-600 leading-relaxed">For Service support or assistance, text HELP to +18774622344 or email admin@techieneighbor.net.</p>
                <p class="text-gray-600 leading-relaxed">We may change any short code or telephone number we use to operate the Service at any time and will notify you of these changes. You acknowledge that any messages, including any STOP or HELP requests, you send to a short code or telephone number we have changed may not be received and we will not be responsible for honoring requests made in such messages.</p>
                <p class="text-gray-600 leading-relaxed">The wireless carriers supported by the Service are not liable for delayed or undelivered messages. You agree to provide us with a valid mobile number. If you get a new mobile number, you will need to sign up for the program with your new number.</p>
                <p class="text-gray-600 leading-relaxed">To the extent permitted by applicable law, you agree that we will not be liable for failed, delayed, or misdirected delivery of any information sent through the Service, any errors in such information, and/or any action you may or may not take in reliance on the information or Service.</p>
                <p class="text-gray-600 leading-relaxed">We respect your right to privacy. To see how we collect and use your personal information, please see our Privacy Notice.</p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>
  </main>

  <!-- Klaviyo Newsletter Signup -->
  <section class="w-full py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-teal-200">
    <div class="container px-4 md:px-6 mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Stay Updated with Tech Tips & Local Business Insights</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the latest web development tips, local business strategies, and tech insights delivered to your inbox.
          </p>
        </div>
        <div class="klaviyo-form-X92dvk"></div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full py-6 bg-gradient-to-br from-teal-900 to-teal-800 text-white">
    <div class="container px-4 md:px-6 mx-auto">
      <div class="text-center">
        <p class="text-sm text-teal-200">© 2026 TechieNeighbor. All rights reserved.</p>
        <div class="mt-4">
          <a href="/" class="text-teal-200 hover:text-white transition-colors" on:click={() => track('Back to Home Clicked', { page: 'Terms of Service' })}>← Back to Home</a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; max-width: 80rem; }
  @media (min-width: 640px) { .container { padding-left: 1.5rem; padding-right: 1.5rem; } }
  @media (min-width: 1024px) { .container { padding-left: 2rem; padding-right: 2rem; } }
  .glow-text { text-shadow: 0 0 10px rgba(20, 184, 166, 0.3); transition: text-shadow 0.3s ease; }
  .glow-text:hover { text-shadow: 0 0 15px rgba(20, 184, 166, 0.5); }
  .nav-link { 
    position: relative; 
    transition: color 0.3s ease; 
    text-shadow:
      0 0 12px rgba(255, 255, 255, 0.6),
      0 0 8px rgba(20, 184, 166, 0.8);
    color: #e0fdfa; /* Light teal default for dark background */
  }
  
  .nav-link:hover {
    text-shadow:
      0 0 16px rgba(255, 255, 255, 0.8),
      0 0 12px rgba(20, 184, 166, 1);
    color: #5eead4; /* Hover color */
  }
  
  .nav-link::after { 
    content: ''; 
    position: absolute; 
    width: 0; 
    height: 2px; 
    bottom: -2px; 
    left: 0; 
    background-color: rgb(20, 184, 166); 
    box-shadow: 0 0 10px rgba(20, 184, 166, 0.5); 
    transition: width 0.3s ease; 
  }
  
  .nav-link:hover::after { 
    width: 100%; 
  }
</style> 