<script>
  import { onMount } from 'svelte';
  import { fadeIn, slideIn } from '../../animations';
  import { track } from '@vercel/analytics';
  
  let visibleSections = {
    header: false,
    content: false
  };
  
  onMount(() => {
    // Track page view
    track('Page View', {
      page: 'Privacy Policy',
      url: '/privacy-policy'
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          visibleSections[sectionId] = true;
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  });
</script>

<svelte:head>
  <title>Privacy Policy | TechieNeighbor</title>
  <meta name="description" content="Privacy Policy for TechieNeighbor - Learn how we collect, use, and protect your personal information." />
  <link rel="canonical" href="https://techieneighbor.net/privacy-policy" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Privacy Policy | TechieNeighbor" />
  <meta property="og:description" content="Privacy Policy for TechieNeighbor - Learn how we collect, use, and protect your personal information." />
  <meta property="og:url" content="https://techieneighbor.net/privacy-policy" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter -->
  <meta property="twitter:title" content="Privacy Policy | TechieNeighbor" />
  <meta property="twitter:description" content="Privacy Policy for TechieNeighbor - Learn how we collect, use, and protect your personal information." />
  <meta property="twitter:url" content="https://techieneighbor.net/privacy-policy" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
    <div class="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
      <div class="flex items-center gap-2">
        <!-- Server icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 md:h-6 md:w-6 text-teal-400">
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
          <line x1="6" x2="6" y1="6" y2="6"></line>
          <line x1="6" x2="6" y1="18" y2="18"></line>
        </svg>
        <a href="/" class="text-lg md:text-xl font-bold text-white hover:text-teal-400 transition-colors">TechieNeighbor</a>
      </div>
      
      <nav class="hidden md:flex gap-6">
        <a href="/#services" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'Services' })}>Services</a>
        <a href="/#about" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'About' })}>About</a>
        <a href="/#portfolio" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'Portfolio' })}>Portfolio</a>
        <a href="/pricing" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'Pricing' })}>Pricing</a>
        <a href="/home-improvement" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'Home Improvement' })}>Home Improvement</a>
        <a href="/#contact" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Privacy Policy', link: 'Contact' })}>Contact</a>
      </nav>
      
      <a href="tel:470-962-1059" class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors" on:click={() => track('Phone Call Clicked', { page: 'Privacy Policy', location: 'header' })}>
        Get in Touch
      </a>
    </div>
  </header>

  <main class="flex-1">
    <!-- Privacy Policy Content -->
    <section id="header" class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.header}
          <div class="max-w-4xl mx-auto text-center" in:fadeIn>
            <div class="space-y-4">
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter glow-text">
                Privacy Policy
              </h1>
              <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
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
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p class="text-gray-600 leading-relaxed">
                  TechieNeighbor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at techieneighbor.net or use our services.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We may collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul class="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>Fill out our contact form</li>
                      <li>Request a quote for our services</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Engage with our social media accounts</li>
                    </ul>
                    <p class="text-gray-600 leading-relaxed mt-2">
                      This information may include your name, email address, phone number, company name, and any other information you choose to provide.
                    </p>
                  </div>
                  
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
                    <p class="text-gray-600 leading-relaxed">
                      When you visit our website, we automatically collect certain information about your device, including:
                    </p>
                    <ul class="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Operating system</li>
                      <li>Pages visited and time spent on each page</li>
                      <li>Referring website</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p class="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide and maintain our services</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                <p class="text-gray-600 leading-relaxed mb-4">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files that are stored on your device when you visit our website.
                </p>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Types of Cookies We Use</h3>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                      <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                      <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track marketing campaign performance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Managing Cookies</h3>
                    <p class="text-gray-600 leading-relaxed">
                      You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">SMS Communications and Cart Tracking</h2>
                <p class="text-gray-600 leading-relaxed mb-4">
                  TechieNeighbor may collect your phone number when you interact with our website or services. We use your phone number to send you important updates, marketing communications, and cart reminder messages via SMS. You may opt out of SMS communications at any time by following the opt-out instructions in the message.
                </p>
                <p class="text-gray-600 leading-relaxed mb-4">
                  TechieNeighbor's website uses cookies to help keep track of items you put into your shopping cart, including when you have abandoned your cart. This information is used to determine when to send cart reminder messages via SMS.
                </p>
                <p class="text-gray-600 leading-relaxed">
                  We do not sell or share your personal information with non-affiliated third parties for their own marketing purposes. The above excludes text messaging originator opt-in data and consent; this information will not be shared with any third parties.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Payment Processing - Stripe</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We use Stripe to process payments for our services. When you make a payment, your payment information is collected and processed by Stripe in accordance with their Privacy Policy. We do not store your complete payment information on our servers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Marketing - Klaviyo</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We use Klaviyo for email marketing and customer relationship management. When you subscribe to our newsletter or provide your email address, your information may be stored and processed by Klaviyo in accordance with their Privacy Policy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Analytics - Vercel Analytics</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We use Vercel Analytics to understand how visitors interact with our website. This service may collect information about your device and browsing behavior.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p class="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <p class="text-gray-600 leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p class="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-1">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to delete your personal information</li>
                  <li>The right to restrict processing of your information</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing</li>
                </ul>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p class="text-gray-600 leading-relaxed">
                  Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                <p class="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p class="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div class="mt-4 space-y-2">
                  <p class="text-gray-600">
                    <strong>Email:</strong> contact@techieneighbor.net
                  </p>
                  <p class="text-gray-600">
                    <strong>Phone:</strong> (470) 962-1059
                  </p>
                  <p class="text-gray-600">
                    <strong>Address:</strong> Gwinnett County, Georgia
                  </p>
                </div>
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
          <a href="/" class="text-teal-200 hover:text-white transition-colors" on:click={() => track('Back to Home Clicked', { page: 'Privacy Policy' })}>← Back to Home</a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 80rem;
  }
  
  @media (min-width: 640px) {
    .container {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    .container {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  /* Glow effect for headers */
  .glow-text {
    text-shadow: 0 0 10px rgba(20, 184, 166, 0.3);
    transition: text-shadow 0.3s ease;
  }

  .glow-text:hover {
    text-shadow: 0 0 15px rgba(20, 184, 166, 0.5);
  }

  /* Navbar glow effect */
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

  /* Prose styling */
  .prose {
    color: #374151;
  }

  .prose h2 {
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .prose h3 {
    color: #1f2937;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .prose p {
    margin-bottom: 1rem;
  }

  .prose ul {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  .prose li {
    margin-bottom: 0.25rem;
  }
</style> 