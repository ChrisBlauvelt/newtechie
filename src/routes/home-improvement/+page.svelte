<script>
  import { onMount } from 'svelte';
  import { fadeIn, scaleIn, slideIn } from '../../animations';
  import { track } from '@vercel/analytics';
  
  // Reactive state for mobile menu
  let mobileMenuOpen = false;
  let visibleSections = {
    hero: false,
    benefits: false,
    features: false,
    voice: false,
    contact: false
  };
  
  let audioElement;
  
  // Function to toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  // Function to close mobile menu when clicking a link
  function closeMenu() {
    mobileMenuOpen = false;
  }

  // Function to handle "Get in Touch" button click
  function handleGetInTouch(event) {
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Track the button click
    track('Get in Touch Button Clicked', {
      page: 'Home Improvement',
      location: 'hero_section',
      device: isMobile ? 'mobile' : 'desktop'
    });
    
    if (isMobile) {
      // On mobile: open phone dialer
      window.location.href = 'tel:470-962-1059';
    } else {
      // On desktop: navigate to homepage contact form
      window.location.href = '/#contact';
    }
  }

  // Intersection Observer for animations
  onMount(() => {
    // Track page view
    track('Page View', {
      page: 'Home Improvement',
      url: '/home-improvement'
    });
    
    // Play the Tim Allen grunt sound when page loads
    if (audioElement) {
      audioElement.volume = 0.3; // Set volume to 30% to not be too loud
      audioElement.play().catch(e => {
        // Silently handle any autoplay restrictions
        console.log('Audio autoplay blocked by browser');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          if (visibleSections.hasOwnProperty(section)) {
            visibleSections[section] = true;
            visibleSections = visibleSections; // Trigger reactivity
            
            // Track section visibility
            track('Section Viewed', {
              page: 'Home Improvement',
              section: section
            });
          }
        }
      });
    }, { threshold: 0.1 });

    // Observe all sections
    Object.keys(visibleSections).forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Smart Home Integration Services | Home Assistant Setup in Gwinnett</title>
  <meta name="description" content="Transform your home with smart automation using Home Assistant. Local voice control, privacy-focused, and seamless integration of any smart home brand. Serving Gwinnett County and Metro Atlanta." />
  <meta name="keywords" content="smart home automation, home assistant, voice control, smart home integration, gwinnett county, atlanta, local voice control, privacy smart home" />
</svelte:head>

<!-- Hidden audio element for the Tim Allen grunt -->
<audio bind:this={audioElement} preload="auto">
  <source src="/sounds/tim-allen-grunt.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<!-- Header -->
<header class="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
  <div class="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center space-x-2">
        <span class="text-lg md:text-xl font-bold text-teal-600">TechieNeighbor</span>
      </a>
      
      <!-- Get in Touch button - visible on both mobile and desktop with responsive sizing -->
      <button class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors" on:click={handleGetInTouch}>
        Get in Touch
      </button>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex gap-6">
      <a href="/#services" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" aria-label="View Services" on:click={() => track('Navigation Click', { page: 'Home Improvement', link: 'Services' })}>Services</a>
      <a href="/#about" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" aria-label="Learn About Us" on:click={() => track('Navigation Click', { page: 'Home Improvement', link: 'About' })}>About</a>
      <a href="/#portfolio" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" aria-label="View Portfolio" on:click={() => track('Navigation Click', { page: 'Home Improvement', link: 'Portfolio' })}>Portfolio</a>
      <a href="/home-improvement" class="nav-link text-sm font-medium text-teal-600 transition-colors" aria-label="Home Improvement" on:click={() => track('Navigation Click', { page: 'Home Improvement', link: 'Home Improvement' })}>Home Improvement</a>
      <a href="/#contact" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" aria-label="Contact Us" on:click={() => track('Navigation Click', { page: 'Home Improvement', link: 'Contact' })}>Contact</a>
    </nav>

    <!-- Mobile menu button -->
    <button on:click={() => {
      toggleMobileMenu();
      track('Mobile Menu Toggled', { page: 'Home Improvement', action: mobileMenuOpen ? 'close' : 'open' });
    }} class="md:hidden p-2">
      <span class="sr-only">Toggle menu</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
      </svg>
    </button>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="absolute top-full left-0 w-full bg-background border-b md:hidden">
        <nav class="container py-4 flex flex-col space-y-4">
          <a href="/#services" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Home Improvement', link: 'Services' });
          }} class="text-sm font-medium hover:text-teal-600 transition-colors" aria-label="View Services">Services</a>
          <a href="/#about" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Home Improvement', link: 'About' });
          }} class="text-sm font-medium hover:text-teal-600 transition-colors" aria-label="Learn About Us">About</a>
          <a href="/#portfolio" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Home Improvement', link: 'Portfolio' });
          }} class="text-sm font-medium hover:text-teal-600 transition-colors" aria-label="View Portfolio">Portfolio</a>
          <a href="/home-improvement" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Home Improvement', link: 'Home Improvement' });
          }} class="text-sm font-medium text-teal-600 transition-colors" aria-label="Home Improvement">Home Improvement</a>
          <a href="/#contact" on:click={() => {
            closeMenu();
            track('Mobile Navigation Click', { page: 'Home Improvement', link: 'Contact' });
          }} class="text-sm font-medium hover:text-teal-600 transition-colors" aria-label="Contact Us">Contact</a>
          
          <!-- Mobile Get in Touch button -->
          <button class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full text-center" on:click={() => {
            closeMenu();
            handleGetInTouch();
          }}>
            Get in Touch
          </button>
        </nav>
      </div>
    {/if}
  </div>
</header>

<!-- Hero Section -->
<section id="hero" class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-teal-50 to-blue-50">
  <div class="container px-4 md:px-6 mx-auto">
    {#if visibleSections.hero}
      <div class="flex flex-col items-center justify-center space-y-4 text-center" in:fadeIn>
        <div class="space-y-2">
          <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Smart Home Integration</div>
          <h1 class="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter glow-text">
            Transform Your Home with
            <span class="text-teal-600">Smart Automation</span>
          </h1>
          <p class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl">
            Integrate nearly any brand of smart home equipment into a sleek, user-friendly dashboard using Home Assistant. 
            Enjoy local voice control and complete privacy with our fully-local smart home solutions.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            on:click={handleGetInTouch}
            class="get-in-touch-btn inline-flex h-12 items-center justify-center rounded-lg bg-teal-600 px-8 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Get Free Consultation
          </button>
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- Benefits Section -->
<section id="benefits" class="w-full py-8 md:py-12 lg:py-24">
  <div class="container px-4 md:px-6 mx-auto">
    {#if visibleSections.benefits}
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12" in:fadeIn>
        <div class="space-y-2">
          <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Why Choose TechieNeighbor to Implement Your Smart Home?</div>
          <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter text-gray-100 glow-text">Privacy & Control You Deserve</h2>
          <p class="max-w-[900px] text-gray-300 text-sm md:text-base lg:text-xl font-medium">
            Unlike cloud-based solutions, our Home Assistant setup keeps your data local and gives you complete control over your smart home.
          </p>
        </div>
      </div>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <!-- Privacy First -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group" 
             in:fadeIn={{ delay: 0 * 100 }}>
          <div class="p-6 pb-2">
            <div class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 group-hover:text-teal-400 transition-colors duration-300">Privacy First</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-300 font-medium">
              Your data stays in your home. No cloud servers, no third-party tracking, complete privacy and security.
            </p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">No cloud dependency</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">Complete data control</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">Works offline</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Universal Compatibility -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group" 
             in:fadeIn={{ delay: 1 * 100 }}>
          <div class="p-6 pb-2">
            <div class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                <path d="M8.5 8.5v.01"></path>
                <path d="M16 15.5v.01"></path>
                <path d="M12 12v.01"></path>
                <path d="M11 17v.01"></path>
                <path d="M7 14v.01"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 group-hover:text-teal-400 transition-colors duration-300">Universal Compatibility</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-300 font-medium">
              Integrate nearly any smart home brand - Philips Hue, Nest, Ring, Samsung, and hundreds more in one unified system.
            </p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">Works with any brand</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">Unified dashboard</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-teal-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-sm text-gray-200">No vendor lock-in</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Local Voice Control -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group" 
             in:fadeIn={{ delay: 2 * 100 }}>
          <div class="p-6 pb-2">
            <div class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 group-hover:text-teal-400 transition-colors duration-300">Local Voice Control</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-300 font-medium leading-relaxed">
              Set up local voice control using open-source hardware like ESP32 or Raspberry Pi. No internet required, 
              complete privacy.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-200">Open-source voice hardware</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-200">Local speech recognition</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-200">Voice command customization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- Features Section -->
<section id="features" class="w-full py-8 md:py-12 lg:py-24 bg-gray-50">
  <div class="container px-4 md:px-6 mx-auto">
    {#if visibleSections.features}
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12" in:fadeIn>
        <div class="space-y-2">
          <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">What We Offer</div>
          <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter glow-text">Complete Smart Home Solutions</h2>
          <p class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl">
            From initial setup to advanced automation, we provide everything you need for a truly smart home. We specialize in <a href="https://homeassistant.io" target="_blank" rel="noopener noreferrer" class="text-teal-600 hover:text-teal-700 underline">Home Assistant</a>, the world's most powerful open-source home automation platform, with TechieNeighbor's preferred system being the Home Assistant Yellow for optimal performance and reliability.
          </p>
        </div>
      </div>
      
      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center justify-center max-w-6xl mx-auto">
        <div class="space-y-6" in:fadeIn={{ delay: 200 }}>
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-gray-900">Home Assistant Setup & Configuration</h3>
            <p class="text-gray-600 leading-relaxed">
              Professional installation and configuration of Home Assistant on your preferred hardware. We'll set up a robust, 
              reliable system that grows with your needs.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Hardware selection and installation</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Device integration and testing</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Custom dashboard design</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Automation setup and optimization</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="space-y-6" in:fadeIn={{ delay: 400 }}>
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-gray-900">Voice Control Integration</h3>
            <p class="text-gray-600 leading-relaxed">
              Set up local voice control using open-source hardware like ESP32 or Raspberry Pi. No internet required, 
              complete privacy, and custom wake words.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Open-source voice hardware</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Local speech recognition</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="text-gray-700">Voice command customization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="w-full py-8 md:py-12 lg:py-24">
  <div class="container px-4 md:px-6 mx-auto">
    {#if visibleSections.contact}
      <div class="flex flex-col items-center justify-center space-y-4 text-center mb-12" in:fadeIn>
        <div class="space-y-2">
          <div class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Ready to Get Started?</div>
          <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter text-gray-100 glow-text">Transform Your Home Today</h2>
          <p class="max-w-[900px] text-gray-300 text-sm md:text-base lg:text-xl font-medium">
            Let's discuss your smart home goals and create a custom solution that fits your lifestyle and budget.
          </p>
        </div>
      </div>
      
      <div class="max-w-4xl mx-auto text-center">
        <div class="grid gap-8 md:grid-cols-2">
          <div class="space-y-4" in:fadeIn={{ delay: 200 }}>
            <div class="rounded-full w-16 h-16 flex items-center justify-center bg-teal-100 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-teal-700">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100">Call for Free Consultation</h3>
            <p class="text-gray-300 font-medium">Speak directly with me about your smart home needs and get a personalized quote.</p>
            <button 
              on:click={handleGetInTouch}
              class="inline-flex h-12 items-center justify-center rounded-lg bg-teal-600 px-8 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Call (470) 962-1059
            </button>
          </div>
          
          <div class="space-y-4" in:fadeIn={{ delay: 400 }}>
            <div class="rounded-full w-16 h-16 flex items-center justify-center bg-teal-100 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-teal-700">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100">Email for Details</h3>
            <p class="text-gray-300 font-medium">Send me a message with your requirements and I'll get back to you within 24 hours.</p>
            <a 
              href="mailto:chris@techieneighbor.net"
              class="inline-flex h-12 items-center justify-center rounded-lg border border-teal-600 px-8 text-sm font-medium text-teal-600 shadow-lg transition-all duration-300 hover:bg-teal-600 hover:text-white hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Email Chris
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

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
<footer class="w-full border-t bg-background">
  <div class="container px-4 md:px-6 py-8 mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div class="flex items-center space-x-2">
        <span class="text-lg font-bold text-teal-600">TechieNeighbor</span>
      </div>
      <div class="flex items-center space-x-4 text-sm text-gray-600">
        <span>© 2026 TechieNeighbor. All rights reserved.</span>
        <a href="/" class="hover:text-teal-600 transition-colors">Home</a>
        <a href="/terms-of-service" class="hover:text-teal-600 transition-colors">Terms</a>
        <a href="/privacy-policy" class="hover:text-teal-600 transition-colors">Privacy</a>
      </div>
    </div>
  </div>
</footer>

<style>
  /* Navbar glow effect */
  .nav-link {
    position: relative;
    transition: color 0.3s ease;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  }
  
  .nav-link:hover {
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
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

  /* Glow text effect */
  .glow-text {
    text-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
  }

  /* Button animations */
  .get-in-touch-btn {
    position: relative;
    overflow: hidden;
  }

  .get-in-touch-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .get-in-touch-btn:hover::before {
    left: 100%;
  }
</style> 