<script>
  import { onMount } from 'svelte';
  import { fadeIn, slideIn } from '../../animations';
  import { track } from '@vercel/analytics';
  
  let pricingDropdownOpen = false;
  let mobileMenuOpen = false;
  
  let visibleSections = {
    header: false,
    pricing: false,
    custom: false
  };
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMenu() {
    mobileMenuOpen = false;
  }
  
  onMount(() => {
    // Track page view
    track('Page View', {
      page: 'Pricing',
      url: '/pricing'
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          visibleSections[sectionId] = true;
          
          // Track section visibility
          track('Section Viewed', {
            page: 'Pricing',
            section: sectionId
          });
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
  
  // Function to track pricing card interactions
  function trackPricingCardHover(service) {
    track('Pricing Card Hovered', {
      page: 'Pricing',
      service: service
    });
  }
  
  // Function to track CTA button clicks
  function trackCTAClick(action) {
    track('Pricing CTA Clicked', {
      page: 'Pricing',
      action: action
    });
  }
</script>

<svelte:head>
  <title>Pricing | TechieNeighbor</title>
  <meta name="description" content="Transparent pricing for TechieNeighbor's IT services - Custom packages tailored to your unique needs with competitive base rates." />
  <link rel="canonical" href="https://techieneighbor.net/pricing" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Pricing | TechieNeighbor" />
  <meta property="og:description" content="Transparent pricing for TechieNeighbor's IT services - Custom packages tailored to your unique needs with competitive base rates." />
  <meta property="og:url" content="https://techieneighbor.net/pricing" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter -->
  <meta property="twitter:title" content="Pricing | TechieNeighbor" />
  <meta property="twitter:description" content="Transparent pricing for TechieNeighbor's IT services - Custom packages tailored to your unique needs with competitive base rates." />
  <meta property="twitter:url" content="https://techieneighbor.net/pricing" />
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
        <a href="/#services" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Services' })}>Services</a>
        <a href="/#about" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'About' })}>About</a>
        <a href="/#portfolio" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Portfolio' })}>Portfolio</a>
        
        <!-- Pricing dropdown -->
        <div class="relative" role="group" on:mouseenter={() => pricingDropdownOpen = true} on:mouseleave={() => pricingDropdownOpen = false}>
          <button class="nav-link text-sm font-medium text-teal-600 transition-colors flex items-center gap-1" aria-label="View Pricing">
            Pricing
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {#if pricingDropdownOpen}
            <div class="absolute top-full left-0 pt-2 w-56 z-50">
              <div class="bg-white border border-gray-200 rounded-md shadow-lg py-2">
                <a href="/pricing" class="block px-4 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Pricing - General' })}>
                  General Pricing
                </a>
                <a href="/pricing/small-business" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Pricing - Small Business' })}>
                  Small Business Digital Success
                </a>
              </div>
            </div>
          {/if}
        </div>
        
        <a href="/home-improvement" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Home Improvement' })}>Home Improvement</a>
        <a href="/#contact" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => track('Navigation Click', { page: 'Pricing', link: 'Contact' })}>Contact</a>
      </nav>
      
      <div class="flex items-center gap-2">
        <a href="tel:470-962-1059" class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors" on:click={() => track('Phone Call Clicked', { page: 'Pricing', location: 'header' })}>
          Get in Touch
        </a>
        
        <!-- Mobile menu button -->
        <button on:click={() => {
          toggleMobileMenu();
          track('Mobile Menu Toggled', { page: 'Pricing', action: mobileMenuOpen ? 'close' : 'open' });
        }} class="md:hidden p-2 text-white" aria-label="Toggle menu">
          <span class="sr-only">Toggle menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="md:hidden bg-slate-900 border-t border-slate-700/50">
        <nav class="container py-4 flex flex-col space-y-4">
          <a href="/#services" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Pricing', link: 'Services' });
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Services</a>
          <a href="/#about" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Pricing', link: 'About' });
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">About</a>
          <a href="/#portfolio" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Pricing', link: 'Portfolio' });
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Portfolio</a>
          
          <!-- Pricing submenu -->
          <div class="pl-2 space-y-2">
            <div class="text-xs font-semibold text-gray-500 uppercase">Pricing</div>
            <a href="/pricing" on:click={() => {
              closeMenu();
              track('Mobile Navigation Click', { page: 'Pricing', link: 'Pricing - General' });
            }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block">General Pricing</a>
            <a href="/pricing/small-business" on:click={() => {
              closeMenu();
              track('Mobile Navigation Click', { page: 'Pricing', link: 'Pricing - Small Business' });
            }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block">Small Business Digital Success</a>
          </div>
          
          <a href="/home-improvement" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Pricing', link: 'Home Improvement' });
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Home Improvement</a>
          <a href="/#contact" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Pricing', link: 'Contact' });
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Contact</a>
        </nav>
      </div>
    {/if}
  </header>

  <main class="flex-1">
    <!-- Hero Section -->
    <section id="header" class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.header}
          <div class="max-w-4xl mx-auto text-center" in:fadeIn>
            <div class="space-y-4">
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter glow-text">
                Transparent Pricing
              </h1>
              <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Every IT project is unique. We provide custom packages tailored to your specific needs with competitive base rates to get you started.
              </p>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Custom Packages Section -->
    <section id="custom" class="w-full py-8 md:py-12 lg:py-24 bg-gray-50">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.custom}
          <div class="max-w-4xl mx-auto" in:slideIn={{ direction: 'up' }}>
            <div class="text-center mb-12">
              <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Custom Packages?
              </h2>
              <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                IT solutions are never one-size-fits-all. Your business has unique requirements, challenges, and goals. That's why we create custom packages designed specifically for your situation.
              </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Tailored Solutions</h3>
                </div>
                <p class="text-gray-600">
                  We analyze your specific needs, budget, and timeline to create a solution that works perfectly for your business, not a generic template.
                </p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Scalable Growth</h3>
                </div>
                <p class="text-gray-600">
                  Our solutions grow with your business. We build with future expansion in mind, so you won't need to start over as your needs evolve.
                </p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                      <path d="M8.5 8.5v.01"></path>
                      <path d="M16 15.5v.01"></path>
                      <path d="M12 12v.01"></path>
                      <path d="M11 17v.01"></path>
                      <path d="M7 14v.01"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Local Expertise</h3>
                </div>
                <p class="text-gray-600">
                  As your Gwinnett County neighbor, we understand the local market and can provide solutions that work specifically for businesses in our area.
                </p>
              </div>
              
              <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-600">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Ongoing Support</h3>
                </div>
                <p class="text-gray-600">
                  We don't just build and leave. We provide ongoing support, maintenance, and updates to ensure your solution continues to serve your business effectively.
                </p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Base Rates Section -->
    <section id="pricing" class="w-full py-8 md:py-12 lg:py-24 bg-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.pricing}
          <div class="max-w-6xl mx-auto" in:slideIn={{ direction: 'up' }}>
            <div class="text-center mb-12">
              <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Base Rates & Starting Points
              </h2>
              <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                These are our starting rates for common services. Final pricing depends on your specific requirements, complexity, and scope of work.
              </p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Diagnostics & Troubleshooting -->
              <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200 hover:shadow-lg transition-shadow"
                   role="button"
                   tabindex="0"
                   aria-label="Diagnostics & Troubleshooting pricing card"
                   on:mouseenter={() => trackPricingCardHover('Diagnostics & Troubleshooting')}>
                <div class="text-center mb-4">
                  <div class="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-white">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                      <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                      <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                      <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Diagnostics & Troubleshooting</h3>
                  <div class="text-3xl font-bold text-teal-600 mt-2">$75</div>
                  <p class="text-sm text-gray-600 mt-1">Base Rate</p>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    House calls & businesses
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    System diagnostics
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Problem identification
                  </li>
                </ul>
              </div>

              <!-- UniFi & Home Assistant -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow"
                   role="button"
                   tabindex="0"
                   aria-label="UniFi & Home Assistant pricing card"
                   on:mouseenter={() => trackPricingCardHover('UniFi & Home Assistant')}>
                <div class="text-center mb-4">
                  <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-white">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                      <path d="M8.5 8.5v.01"></path>
                      <path d="M16 15.5v.01"></path>
                      <path d="M12 12v.01"></path>
                      <path d="M11 17v.01"></path>
                      <path d="M7 14v.01"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">UniFi & Home Assistant</h3>
                  <div class="text-3xl font-bold text-blue-600 mt-2">$150</div>
                  <p class="text-sm text-gray-600 mt-1">Base Rate</p>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    System installation
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Configuration setup
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Basic automation
                  </li>
                </ul>
              </div>

              <!-- Single Page Websites -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-lg transition-shadow"
                   role="button"
                   tabindex="0"
                   aria-label="Single Page Websites pricing card"
                   on:mouseenter={() => trackPricingCardHover('Single Page Websites')}>
                <div class="text-center mb-4">
                  <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-white">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Single Page Websites</h3>
                  <div class="text-3xl font-bold text-purple-600 mt-2">$750</div>
                  <p class="text-sm text-gray-600 mt-1">Base Rate</p>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-purple-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Responsive design
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-purple-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    SEO optimization
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-purple-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Contact forms
                  </li>
                </ul>
              </div>

              <!-- Monthly Web Hosting -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 hover:shadow-lg transition-shadow"
                   role="button"
                   tabindex="0"
                   aria-label="Monthly Web Hosting pricing card"
                   on:mouseenter={() => trackPricingCardHover('Monthly Web Hosting')}>
                <div class="text-center mb-4">
                  <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-white">
                      <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                      <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                      <line x1="6" x2="6" y1="6" y2="6"></line>
                      <line x1="6" x2="6" y1="18" y2="18"></line>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Monthly Web Hosting</h3>
                  <div class="text-3xl font-bold text-green-600 mt-2">$10</div>
                  <p class="text-sm text-gray-600 mt-1">Per Month</p>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Reliable hosting
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    SSL certificates
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Regular backups
                  </li>
                </ul>
              </div>
            </div>

            <!-- Call to Action -->
            <div class="text-center mt-12">
              <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-lg border border-teal-200">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Contact us for a free consultation. We'll discuss your specific needs and provide a custom quote tailored to your project.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:470-962-1059" 
                     class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                     on:click={() => trackCTAClick('phone_call')}>
                    Call (470) 962-1059
                  </a>
                  <a href="/#contact" 
                     class="border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-md font-medium transition-colors"
                     on:click={() => trackCTAClick('contact_form')}>
                    Get Free Quote
                  </a>
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
          <a href="/" class="text-teal-200 hover:text-white transition-colors" on:click={() => track('Back to Home Clicked', { page: 'Pricing' })}>← Back to Home</a>
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
</style> 