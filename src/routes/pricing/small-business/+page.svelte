<script>
  import { onMount } from 'svelte';
  import { fadeIn, slideIn } from '../../../animations';
  import { track } from '@vercel/analytics';
  
  // Mobile menu state
  let mobileMenuOpen = false;
  let pricingDropdownOpen = false;
  
  // Function to toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  // Function to close mobile menu when clicking a link
  function closeMenu() {
    mobileMenuOpen = false;
  }
  
  // Contact form modal state
  let showContactModal = false;
  let formData = {
    name: '',
    email: '',
    message: ''
  };
  let isSubmitting = false;
  let submitStatus = 'idle'; // 'idle' | 'success' | 'error'
  let errorMessage = '';
  let modalSource = '';
  let lastFocusedElement = null; // Store the element that triggered the modal
  let modalElement = null; // Reference to the modal element
  
  // Function to open modal
  function openModal(source) {
    // Store the currently focused element
    lastFocusedElement = document.activeElement;
    
    showContactModal = true;
    modalSource = source;
    document.body.style.overflow = 'hidden';
    
    // Track modal opened event
    track('Contact Modal Opened', {
      page: 'Small Business Pricing',
      source: source
    });
    
    // Focus the first input field after modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('name');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
  
  // Function to close modal
  function closeModal() {
    showContactModal = false;
    document.body.style.overflow = '';
    
    // Track modal closed event
    track('Contact Modal Closed', {
      page: 'Small Business Pricing'
    });
    
    // Return focus to the element that opened the modal
    if (lastFocusedElement) {
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 100);
    }
  }
  
  // Focus trap handler
  function handleModalKeydown(event) {
    if (!showContactModal) return;
    
    // Handle Escape key
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    
    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      const focusableElements = modalElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift+tab on first element, go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If tab on last element, go to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  // Function to reset form
  function resetForm() {
    formData = {
      name: '',
      email: '',
      message: ''
    };
    submitStatus = 'idle';
    errorMessage = '';
  }
  
  // Handle Escape key to close modal
  function handleKeydown(event) {
    handleModalKeydown(event);
  }
  
  // Client-side validation
  function validateForm() {
    const { name, email, message } = formData;
    
    // Check required fields
    if (!name || !email || !message) {
      return 'All fields are required';
    }
    
    // Trim and check for empty after trim
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return 'All fields are required';
    }
    
    // Check field lengths
    if (trimmedName.length > 200) {
      return 'Name must be 200 characters or less';
    }
    
    if (trimmedEmail.length > 200) {
      return 'Email must be 200 characters or less';
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return 'Please provide a valid email address';
    }
    
    return null;
  }
  
  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    
    // Reset previous status
    submitStatus = 'idle';
    errorMessage = '';
    
    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      submitStatus = 'error';
      errorMessage = validationError;
      return;
    }
    
    // Set loading state
    isSubmitting = true;
    
    try {
      // Make POST request to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          source: 'Small Business Pricing Page'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success - show success message
        submitStatus = 'success';
        
        // Track successful submission
        track('Contact Form Submitted', {
          page: 'Small Business Pricing',
          source: modalSource
        });
        
        // Clear form and close modal after 2 seconds
        setTimeout(() => {
          resetForm();
          closeModal();
        }, 2000);
      } else {
        // API returned error
        submitStatus = 'error';
        errorMessage = result.error || 'Failed to send message. Please try again.';
        
        // Track error
        track('Contact Form Error', {
          page: 'Small Business Pricing',
          error: result.error || 'unknown'
        });
      }
    } catch (error) {
      // Network error or other exception
      submitStatus = 'error';
      errorMessage = 'Network error. Please check your connection and try again.';
      
      // Track network error
      track('Contact Form Error', {
        page: 'Small Business Pricing',
        error: 'network'
      });
      
      console.error('Form submission error:', error);
    } finally {
      // Always reset loading state
      isSubmitting = false;
    }
  }
  
  // Pricing tiers data model
  const pricingTiers = [
    {
      name: 'Essential Support',
      price: '$350',
      description: '$35/hr • 10 service hours per month. Perfect for basic IT triage and minor web updates.',
      features: [
        '10 flexible service hours/month',
        'Use for Web Dev, IT Helpdesk, or Networking',
        'Guaranteed 48-hour response time',
        'Basic monthly health reports',
        'Rollover up to 5 unused hours',
        'Remote support via email/phone'
      ],
      highlighted: false
    },
    {
      name: 'Business Growth',
      price: '$600',
      description: '$30/hr • 20 service hours per month. Our most popular package for growing small businesses.',
      features: [
        '20 flexible service hours/month',
        'Use for Web Dev, IT Helpdesk, or Networking',
        'Guaranteed 24-hour response time',
        'Priority scheduling for on-site visits',
        'Rollover up to 10 unused hours',
        'Bi-weekly strategy check-ins',
        'Proactive network monitoring'
      ],
      highlighted: true
    },
    {
      name: 'Total Management',
      price: '$1,000',
      description: '$25/hr • 40 service hours per month. Complete oversight for businesses ready to scale.',
      features: [
        '40 flexible service hours/month',
        'Use for Web Dev, IT Helpdesk, or Networking',
        'Same-day priority response',
        'Dedicated account manager',
        'Rollover up to 20 unused hours',
        'Advanced customized reporting',
        'Quarterly strategy consultations'
      ],
      highlighted: false
    }
  ];
  
  let visibleSections = {
    header: false,
    pricing: false,
    footer: false
  };
  
  onMount(() => {
    // Track page view
    track('Page View', {
      page: 'Small Business Pricing',
      url: '/pricing/small-business'
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          visibleSections[sectionId] = true;
          
          // Track section visibility
          track('Section Viewed', {
            page: 'Small Business Pricing',
            section: sectionId
          });
        }
      });
    }, { 
      threshold: 0.1
    });

    // Observe sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  });
  
  // Function to track pricing card interactions
  function trackPricingCardHover(tierName) {
    track('Pricing Card Hovered', {
      page: 'Small Business Pricing',
      tierName: tierName
    });
  }
  
  // Function to track CTA button clicks
  function trackCTAClick(action) {
    track('Phone Call Clicked', {
      page: 'Small Business Pricing',
      action: action,
      location: action
    });
  }
  
  // Function to track navigation link clicks
  function trackNavigationClick(link) {
    track('Navigation Click', {
      page: 'Small Business Pricing',
      link: link
    });
  }
</script>

<svelte:head>
  <title>Small Business IT & Digital Retainer Packages | TechieNeighbor</title>
  <meta name="description" content="Flexible, hour-based IT and digital retainer packages for small businesses. Get reliable tech support, web development, and networking help in Metro Atlanta." />
  <link rel="canonical" href="https://techieneighbor.net/pricing/small-business" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Small Business IT & Digital Retainer Packages | TechieNeighbor" />
  <meta property="og:description" content="Flexible, hour-based IT and digital retainer packages for small businesses. Get reliable tech support, web development, and networking help in Metro Atlanta." />
  <meta property="og:url" content="https://techieneighbor.net/pricing/small-business" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter -->
  <meta property="twitter:title" content="Small Business IT & Digital Retainer Packages | TechieNeighbor" />
  <meta property="twitter:description" content="Flexible, hour-based IT and digital retainer packages for small businesses. Get reliable tech support, web development, and networking help in Metro Atlanta." />
  <meta property="twitter:url" content="https://techieneighbor.net/pricing/small-business" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

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
        <a href="/#services" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('Services')}>Services</a>
        <a href="/#about" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('About')}>About</a>
        <a href="/#portfolio" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('Portfolio')}>Portfolio</a>
        
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
                <a href="/pricing" class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('Pricing - General')}>
                  General Pricing
                </a>
                <a href="/pricing/small-business" class="block px-4 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 transition-colors" on:click={() => trackNavigationClick('Pricing - Small Business')}>
                  Small Business Digital Success
                </a>
              </div>
            </div>
          {/if}
        </div>
        
        <a href="/home-improvement" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('Home Improvement')}>Home Improvement</a>
        <a href="/#contact" class="nav-link text-sm font-medium hover:text-teal-600 transition-colors" on:click={() => trackNavigationClick('Contact')}>Contact</a>
      </nav>
      
      <div class="flex items-center gap-2">
        <a href="tel:470-962-1059" class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors" on:click={() => trackCTAClick('header')}>
          Get in Touch
        </a>
        
        <!-- Mobile menu button -->
        <button on:click={() => {
          toggleMobileMenu();
          track('Mobile Menu Toggled', { page: 'Small Business Pricing', action: mobileMenuOpen ? 'close' : 'open' });
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
            trackNavigationClick('Services');
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Services</a>
          <a href="/#about" on:click={() => {
            closeMenu();
            trackNavigationClick('About');
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">About</a>
          <a href="/#portfolio" on:click={() => {
            closeMenu();
            trackNavigationClick('Portfolio');
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Portfolio</a>
          
          <!-- Pricing submenu -->
          <div class="pl-2 space-y-2">
            <div class="text-xs font-semibold text-gray-500 uppercase">Pricing</div>
            <a href="/pricing" on:click={() => {
              closeMenu();
              trackNavigationClick('Pricing - General');
            }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block">General Pricing</a>
            <a href="/pricing/small-business" on:click={() => {
              closeMenu();
              trackNavigationClick('Pricing - Small Business');
            }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block">Small Business Digital Success</a>
          </div>
          
          <a href="/home-improvement" on:click={() => {
            closeMenu();
            trackNavigationClick('Home Improvement');
          }} class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">Home Improvement</a>
          <a href="/#contact" on:click={() => {
            closeMenu();
            trackNavigationClick('Contact');
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
            <div class="space-y-3 sm:space-y-4">
              <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter glow-text px-4">
                Flexible IT & Digital Retainer Packages
              </h1>
              <p class="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                Professional technology solutions designed for small businesses. Utilize block-hour retainers for web development, fast proactive I.T. support, and reliable network management.
              </p>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Pricing Cards Section -->
    <section id="pricing" class="w-full py-8 md:py-12 lg:py-24 bg-white">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.pricing}
          <div class="max-w-6xl mx-auto" in:slideIn={{ direction: 'up' }}>
            <div class="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 class="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Choose Your Package
              </h2>
              <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Select the perfect package for your small business's digital needs.
              </p>
            </div>
            
            <!-- Pricing Cards Grid -->
            <!-- Mobile: single column, Tablet: 2 columns, Desktop: 3 columns -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
              {#each pricingTiers as tier, index}
                <div 
                  class="pricing-card relative flex flex-col p-4 sm:p-5 md:p-6 bg-white border-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2"
                  class:border-teal-600={tier.highlighted}
                  class:border-gray-200={!tier.highlighted}
                  class:ring-4={tier.highlighted}
                  class:ring-teal-100={tier.highlighted}
                  style="animation-delay: {index * 100}ms;"
                  on:mouseenter={() => trackPricingCardHover(tier.name)}
                  role="article"
                  aria-label="{tier.name} pricing tier"
                >
                  {#if tier.highlighted}
                    <div class="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Most Popular
                    </div>
                  {/if}
                  
                  <div class="mb-4">
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div class="flex items-baseline mb-2">
                      <span class="text-3xl sm:text-4xl font-bold text-teal-600">{tier.price}</span>
                      <span class="text-sm sm:text-base text-gray-600 ml-2">/month</span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600">{tier.description}</p>
                  </div>
                  
                  <div class="flex-1">
                    <ul class="space-y-2 sm:space-y-3">
                      {#each tier.features as feature}
                        <li class="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 flex-shrink-0 mt-0.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span class="text-xs sm:text-sm text-gray-700">{feature}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                  
                  <div class="mt-4 sm:mt-6">
                    <button 
                      type="button"
                      on:click={() => openModal(tier.name)}
                      class="block w-full text-center py-2 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium transition-colors"
                      class:bg-teal-600={tier.highlighted}
                      class:hover:bg-teal-700={tier.highlighted}
                      class:text-white={tier.highlighted}
                      class:bg-gray-100={!tier.highlighted}
                      class:hover:bg-gray-200={!tier.highlighted}
                      class:text-gray-900={!tier.highlighted}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Footer Notes Section -->
    <section id="footer" class="w-full py-8 md:py-12 bg-gray-50">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.footer}
          <div class="max-w-4xl mx-auto text-center space-y-4" in:slideIn={{ direction: 'up' }}>
            <p class="text-sm md:text-base text-gray-600">
              <strong>How Retainer Hours Work:</strong> Your dedicated block of hours can be used seamlessly across any of our services—from adding a new feature to your web app, to repairing a broken PoE camera, to helping an employee reset their credentials.
            </p>
            <p class="text-sm md:text-base text-gray-600">
              Overage hours beyond your monthly allocation are billed at your tier's discounted hourly rate.
            </p>
            <p class="text-base md:text-lg text-gray-900 font-medium mt-6">
              Ready to get started? <button type="button" class="text-teal-600 hover:text-teal-700 underline transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium" on:click={() => openModal('footer')}>Contact us</button> to find the perfect retainer package for your business.
            </p>
          </div>
        {/if}
      </div>
    </section>
  </main>

  <!-- Klaviyo Newsletter Signup -->
  <section class="w-full py-8 sm:py-10 md:py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-teal-200">
    <div class="container px-4 md:px-6 mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-6 sm:mb-8">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Stay Updated with Tech Tips & Local Business Insights</h2>
          <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Get the latest web development tips, local business strategies, and tech insights delivered to your inbox.
          </p>
        </div>
        <div class="klaviyo-form-X92dvk"></div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full py-4 sm:py-5 md:py-6 bg-gradient-to-br from-teal-900 to-teal-800 text-white">
    <div class="container px-4 md:px-6 mx-auto">
      <div class="text-center">
        <p class="text-xs sm:text-sm text-teal-200">© 2026 TechieNeighbor. All rights reserved.</p>
        <div class="mt-3 sm:mt-4">
          <a href="/" class="text-xs sm:text-sm text-teal-200 hover:text-white transition-colors" on:click={() => track('Back to Home Clicked', { page: 'Small Business Pricing' })}>← Back to Home</a>
        </div>
      </div>
    </div>
  </footer>
</div>

<!-- Contact Form Modal -->
{#if showContactModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    on:click={closeModal}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div 
      bind:this={modalElement}
      class="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6"
      on:click|stopPropagation
      role="document"
    >
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200"
        on:click={closeModal}
        aria-label="Close contact form"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <!-- Modal title -->
      <h2 id="modal-title" class="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
      <p id="modal-description" class="text-sm text-gray-600 mb-6">Fill out the form below and we'll get back to you shortly.</p>
      
      <!-- Form -->
      <form on:submit={handleSubmit} class="space-y-4">
        <!-- Name field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Your name"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-200"
            required
            aria-required="true"
          />
        </div>
        
        <!-- Email field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="your@email.com"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-200"
            required
            aria-required="true"
          />
        </div>
        
        <!-- Message field -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
          <textarea
            id="message"
            bind:value={formData.message}
            placeholder="Tell us about your business and how we can help..."
            rows="4"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-200 resize-none"
            required
            aria-required="true"
          ></textarea>
        </div>
        
        <!-- Submit button -->
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      <!-- Success message -->
      {#if submitStatus === 'success'}
        <div class="mt-4 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md" role="alert" aria-live="polite">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <p class="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
          </div>
        </div>
      {/if}
      
      <!-- Error message -->
      {#if submitStatus === 'error'}
        <div class="mt-4 p-4 bg-red-50 text-red-800 border border-red-200 rounded-md" role="alert" aria-live="polite">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="text-sm font-medium">{errorMessage}</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

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

  /* Pricing card animations */
  .pricing-card {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
