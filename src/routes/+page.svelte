<script>
  import { onMount } from "svelte";
  import { fadeIn, scaleIn, slideIn } from "../animations";
  import confetti from "canvas-confetti";
  import { track } from "@vercel/analytics";
  import AISpotlightHero from "$lib/components/ai-spotlight/AISpotlightHero.svelte";
  import FAQ from "$lib/components/FAQ.svelte";
  import DynamicServiceDemo from "$lib/components/DynamicServiceDemo.svelte";
  import PortfolioBento from "$lib/components/portfolio/PortfolioBento.svelte";

  // Function to track link clicks
  function trackLinkClick(platform, url, location) {
    track("Social Link Click", {
      platform,
      url,
      location,
    });
  }

  // Reactive state for mobile menu
  let mobileMenuOpen = false;
  let pricingDropdownOpen = false;
  let showToast = false;
  let toastMessage = "";
  let showCookieNotice = false;
  let isSubmitting = false;
  let showContactModal = false;
  let visibleSections = {
    hero: false,
    services: false,
    about: false,
    homeAssistant: false,
    portfolio: false,
    contact: false,
  };

  // Responsive navbar state
  let isNavbarCollapsed = false;
  let navbarContainer;
  let navbarItems;

  // Image loading states
  let imageLoadingStates = {
    profile: true,
  };

  const homeFaqs = [
    {
      question: "What technology services do you offer in Gwinnett County?",
      answer: "We provide comprehensive technology solutions including custom web application development, proactive managed I.T. services, structured network cabling, and commercial-grade security camera installations (Ubiquiti/UniFi). We serve small-to-medium businesses throughout Gwinnett County and Metro Atlanta."
    },
    {
      question: "Why should I hire a local web developer instead of an agency?",
      answer: "A local developer like TechieNeighbor provides personalized, direct communication and a deeper understanding of the local Gwinnett market. You won't be passed off to junior account managers. We build high-performance custom applications using modern frameworks like SvelteKit to ensure your business stands out."
    },
    {
      question: "Do you provide on-site I.T. support?",
      answer: "Yes, our Managed I.T. Services include both remote helpdesk support and on-site visits for hardware troubleshooting, network infrastructure upgrades, and security camera installations within Gwinnett County and the surrounding Atlanta area."
    }
  ];

  // Handle image load errors
  function handleImageError(event, site) {
    console.error(`Error loading image for ${site}:`, event);
    event.target.src = "/placeholder.svg?height=500&width=800";
    imageLoadingStates[site] = false;
  }

  // Handle image load success
  function handleImageLoad(site) {
    console.log(`Successfully loaded image for ${site}`);
    imageLoadingStates[site] = false;
  }

  // Function to toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  // Function to close mobile menu when clicking a link
  function closeMenu() {
    mobileMenuOpen = false;
  }

  // Improve Firefox Android detection
  function isFirefoxAndroid() {
    return (
      /Android/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent)
    );
  }

  // Function to trigger confetti
  function triggerConfetti() {
    if (isFirefoxAndroid()) {
      // Fallback: add a CSS class for halo/pulse effect
      const buttons = document.querySelectorAll(".get-in-touch-btn");
      buttons.forEach((button) => {
        button.classList.add("halo-animate");
        setTimeout(() => button.classList.remove("halo-animate"), 1200);
      });
      return;
    }
    console.log("Triggering confetti!");
    console.log(
      "Window dimensions:",
      window.innerWidth,
      "x",
      window.innerHeight,
    );
    console.log("User agent:", navigator.userAgent);

    // Try to create confetti with mobile-specific settings
    try {
      // First, try a simple confetti burst that should work on all devices
      const result = confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#14b8a6", "#0d9488", "#f59e0b"],
        disableForReducedMotion: false,
      });

      console.log("Confetti result:", result);

      // If first burst works, add a second one
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#14b8a6", "#0d9488"],
          disableForReducedMotion: false,
        });
      }, 200);
    } catch (error) {
      console.error("Confetti error:", error);
      // Fallback: show an alert on mobile if confetti fails
      if (window.innerWidth <= 768) {
        // Could add a fallback animation here
        console.log(
          "Confetti failed on mobile, but function was called successfully",
        );
      }
    }
  }

  // Function to handle "Get in Touch" button click
  function handleGetInTouch(event) {
    console.log("Get in Touch button clicked!");

    // Detect if user is on mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth < 768;

    // Track the event
    track("Get in Touch Button Clicked", {
      location: event?.target?.closest("header") ? "header" : "mobile_menu",
      device: isMobile ? "mobile" : "desktop",
    });

    if (isMobile) {
      // On mobile: open phone dialer immediately
      console.log("Mobile device detected - opening phone dialer");
      window.location.href = "tel:470-962-1059";
    } else {
      // On desktop: show contact modal
      const button = event?.target;
      if (button) {
        button.classList.add("celebrate", "pulse-success");
        setTimeout(() => {
          button.classList.remove("celebrate", "pulse-success");
        }, 600);
      }

      // Try confetti
      try {
        triggerConfetti();
      } catch (error) {
        console.log("Confetti failed, but CSS animation should work");
      }

      // Show the contact modal
      setTimeout(() => {
        console.log("Desktop device detected - showing contact modal");
        showContactModal = true;

        // Focus on the name input field after modal opens
        setTimeout(() => {
          const nameInput = document.getElementById("modal-name");
          if (nameInput) {
            nameInput.focus();
          }
        }, 100);
      }, 500);
    }
  }

  // Function to close contact modal
  function closeContactModal() {
    showContactModal = false;
  }

  // Function to show toast
  function showSuccessToast() {
    toastMessage = "Message sent successfully! 🎉";
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Convert FormData to JSON
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    // Disable submit button during submission
    isSubmitting = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        form.reset();
        triggerConfetti(); // Add confetti on successful submission
        showSuccessToast();

        // Track successful form submission
        track("Contact Form Submitted", {
          success: true,
        });
      } else {
        // Display error message from server or default message
        toastMessage =
          result.error || "Oops! Something went wrong. Please try again.";
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 3000);
      }
    } catch (error) {
      // Handle network errors gracefully
      toastMessage =
        "Network error. Please check your connection and try again.";
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 3000);
    } finally {
      // Re-enable submit button after submission completes
      isSubmitting = false;
    }
  }

  // Add this function to handle the "Get a Free Quote" button click
  function handleGetFreeQuote() {
    const contactSection = document.querySelector("#contact");
    const nameField = document.querySelector("#name");

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });

      // Focus the name field after scrolling
      setTimeout(() => {
        if (nameField) {
          nameField.focus();
        }
      }, 800);
    }
  }

  // Smooth scrolling for anchor links and intersection observer for animations
  onMount(() => {
    // Track page view
    track("Page View", {
      page: "Home",
      url: "/",
    });

    // Responsive navbar logic
    function checkNavbarOverflow() {
      if (navbarContainer && navbarItems) {
        const containerWidth = navbarContainer.offsetWidth;
        const itemsWidth = navbarItems.scrollWidth;
        const shouldCollapse = itemsWidth > containerWidth;

        if (shouldCollapse !== isNavbarCollapsed) {
          isNavbarCollapsed = shouldCollapse;
        }
      }
    }

    // Check overflow on mount and resize
    checkNavbarOverflow();
    window.addEventListener("resize", checkNavbarOverflow);

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
          closeMenu();
        }
      });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections[sectionId] = true;

            // Track section visibility
            track("Section Viewed", {
              page: "Home",
              section: sectionId,
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    // Observe all sections
    Object.keys(visibleSections).forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    // Cookie notice logic
    if (!localStorage.getItem("cookieNoticeDismissed")) {
      showCookieNotice = true;
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkNavbarOverflow);
    };
  });

  function dismissCookieNotice() {
    showCookieNotice = false;
    localStorage.setItem("cookieNoticeDismissed", "true");
  }

  let isDarkBg = true; // Default to true on page load (since hero is dark)

  onMount(() => {
    // ... existing code ...

    // Intersection Observer for navbar background detection
    const heroSection = document.getElementById("hero");
    const nav = document.querySelector("nav");
    if (heroSection && nav) {
      const navBgObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If the hero section is intersecting at the top, navbar is over dark bg
            isDarkBg =
              entry.isIntersecting && entry.boundingClientRect.top <= 0;
          });
        },
        { threshold: 0, rootMargin: "-1px 0px 0px 0px" },
      );
      navBgObserver.observe(heroSection);
    }
  });
</script>

<svelte:head>
  <title>Custom App Development & IT Services Gwinnett | TechieNeighbor</title>
  <meta
    name="description"
    content="Top-rated custom application development, managed I.T. services, and professional security camera / network installations for businesses in Gwinnett County."
  />
  <meta property="og:title" content="Custom App Development & IT Services Gwinnett | TechieNeighbor" />
  <meta property="og:description" content="Top-rated custom application development, managed I.T. services, and professional security camera / network installations for businesses in Gwinnett County." />
  <meta property="twitter:title" content="Custom App Development & IT Services Gwinnett | TechieNeighbor" />
  <meta property="twitter:description" content="Top-rated custom application development, managed I.T. services, and professional security camera / network installations for businesses in Gwinnett County." />
  <meta name="keywords" content="application development gwinnett, managed IT services gwinnett, network installation gwinnett county, security camera installation atlanta, custom web apps gwinnett" />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "TechieNeighbor",
      "image": "https://techieneighbor.net/og-image.webp",
      "description": "Top-rated custom application development, managed I.T. services, and professional security camera / network installations for businesses in Gwinnett County.",
      "url": "https://techieneighbor.net",
      "telephone": "470-962-1059",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gwinnett County",
        "addressRegion": "GA",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.9526,
        "longitude": -83.3576
      },
      "areaServed": ["Gwinnett County", "Atlanta", "Metro Atlanta"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Technology Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Application Development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Managed I.T. Services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Networking & Camera Installations"
            }
          }
        ]
      }
    }
  </script>
</svelte:head>

<div class="flex min-h-screen flex-col">
  <header
    class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div
      class="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6"
      bind:this={navbarContainer}
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <!-- Server icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5 md:h-6 md:w-6 text-teal-600"
          >
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
            <line x1="6" x2="6" y1="6" y2="6"></line>
            <line x1="6" x2="6" y1="18" y2="18"></line>
          </svg>
          <span
            class="text-lg md:text-xl font-bold text-teal-50 glow-text drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]"
            >TechieNeighbor</span
          >
        </div>

        <!-- Get in Touch button - visible on both mobile and desktop with responsive sizing -->
        <button
          class="get-in-touch-btn glassmorphic-btn px-2 md:px-4 py-1 md:py-2 rounded-md text-white font-medium transition-colors duration-200 text-xs md:text-sm"
          on:click={handleGetInTouch}
        >
          Get in Touch
        </button>
      </div>

      <!-- Desktop Navigation moved to right -->
      <nav
        class="hidden md:flex gap-6 justify-end flex-1 ml-8"
        class:is-dark-bg={isDarkBg}
        class:collapsed={isNavbarCollapsed}
        bind:this={navbarItems}
      >
        <a
          href="#services"
          class="nav-link text-sm font-medium hover:text-teal-600 transition-colors"
          aria-label="View Services"
          on:click={() =>
            track("Navigation Click", { page: "Home", link: "Services" })}
          >Services</a
        >
        <a
          href="#about"
          class="nav-link text-sm font-medium hover:text-teal-600 transition-colors"
          aria-label="Learn About Us"
          on:click={() =>
            track("Navigation Click", { page: "Home", link: "About" })}>About</a
        >
        <a
          href="#portfolio"
          class="nav-link text-sm font-medium hover:text-teal-600 transition-colors"
          aria-label="View Portfolio"
          on:click={() =>
            track("Navigation Click", { page: "Home", link: "Portfolio" })}
          >Portfolio</a
        >

        <!-- Pricing dropdown -->
        <div
          class="relative"
          role="group"
          on:mouseenter={() => (pricingDropdownOpen = true)}
          on:mouseleave={() => (pricingDropdownOpen = false)}
        >
          <button
            class="nav-link text-sm font-medium hover:text-teal-600 transition-colors flex items-center gap-1"
            aria-label="View Pricing"
          >
            Pricing
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {#if pricingDropdownOpen}
            <div class="absolute top-full left-0 pt-2 w-56 z-50">
              <div
                class="bg-white border border-gray-200 rounded-md shadow-lg py-2"
              >
                <a
                  href="/pricing"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  on:click={() =>
                    track("Navigation Click", {
                      page: "Home",
                      link: "Pricing - General",
                    })}
                >
                  General Pricing
                </a>
                <a
                  href="/pricing/small-business"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  on:click={() =>
                    track("Navigation Click", {
                      page: "Home",
                      link: "Pricing - Small Business",
                    })}
                >
                  Small Business Digital Success
                </a>
              </div>
            </div>
          {/if}
        </div>

        <a
          href="/home-improvement"
          class="nav-link text-sm font-medium hover:text-teal-600 transition-colors"
          aria-label="Home Improvement"
          on:click={() =>
            track("Navigation Click", {
              page: "Home",
              link: "Home Improvement",
            })}>Home Improvement</a
        >
        <a
          href="#contact"
          class="nav-link text-sm font-medium hover:text-teal-600 transition-colors"
          aria-label="Contact Us"
          on:click={() =>
            track("Navigation Click", { page: "Home", link: "Contact" })}
          >Contact</a
        >
      </nav>

      <!-- Mobile menu button - shows on mobile OR when navbar is collapsed -->
      <button
        on:click={() => {
          toggleMobileMenu();
          track("Mobile Menu Toggled", {
            page: "Home",
            action: mobileMenuOpen ? "close" : "open",
          });
        }}
        class="p-2"
        class:md:hidden={!isNavbarCollapsed}
      >
        <span class="sr-only">Toggle menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6"
        >
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation - shows on mobile OR when navbar is collapsed -->
    {#if mobileMenuOpen}
      <div class="bg-white border-b" class:md:hidden={!isNavbarCollapsed}>
        <nav class="container py-4 flex flex-col space-y-4">
          <a
            href="#services"
            on:click={() => {
              closeMenu();
              track("Mobile Navigation Click", {
                page: "Home",
                link: "Services",
              });
            }}
            class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            aria-label="View Services">Services</a
          >
          <a
            href="#about"
            on:click={() => {
              closeMenu();
              track("Mobile Navigation Click", { page: "Home", link: "About" });
            }}
            class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            aria-label="Learn About Us">About</a
          >
          <a
            href="#portfolio"
            on:click={() => {
              closeMenu();
              track("Mobile Navigation Click", {
                page: "Home",
                link: "Portfolio",
              });
            }}
            class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            aria-label="View Portfolio">Portfolio</a
          >

          <!-- Pricing submenu -->
          <div class="pl-2 space-y-2">
            <div class="text-xs font-semibold text-gray-500 uppercase">
              Pricing
            </div>
            <a
              href="/pricing"
              on:click={() => {
                closeMenu();
                track("Mobile Navigation Click", {
                  page: "Home",
                  link: "Pricing - General",
                });
              }}
              class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block"
              aria-label="View General Pricing">General Pricing</a
            >
            <a
              href="/pricing/small-business"
              on:click={() => {
                closeMenu();
                track("Mobile Navigation Click", {
                  page: "Home",
                  link: "Pricing - Small Business",
                });
              }}
              class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors block"
              aria-label="View Small Business Pricing"
              >Small Business Digital Success</a
            >
          </div>

          <a
            href="/home-improvement"
            on:click={() => {
              closeMenu();
              track("Mobile Navigation Click", {
                page: "Home",
                link: "Home Improvement",
              });
            }}
            class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            aria-label="Home Improvement">Home Improvement</a
          >
          <a
            href="#contact"
            on:click={() => {
              closeMenu();
              track("Mobile Navigation Click", {
                page: "Home",
                link: "Contact",
              });
            }}
            class="mobile-nav-link text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            aria-label="Contact Us">Contact</a
          >

          <!-- Mobile Get in Touch button -->
          <button
            class="get-in-touch-btn bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full text-center"
            on:click={() => {
              closeMenu();
              handleGetInTouch();
            }}
          >
            Get in Touch
          </button>
        </nav>
      </div>
    {/if}
  </header>

  <main class="flex-1 bg-transparent">
    <!-- Hero Section -->
    <section
      id="hero"
      class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10 animate-gradient"
      ></div>
      <div class="container px-4 md:px-6 mx-auto">
        <div
          class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center justify-center"
        >
          <div
            class="flex flex-col justify-center space-y-4 text-center lg:text-left mx-auto lg:mx-0"
            in:fadeIn={{ delay: 200 }}
          >
            <div class="space-y-2">
              <h1
                class="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tighter break-words glow-text"
              >
                App Development & Managed IT For Gwinnett
              </h1>
              <p
                class="max-w-[600px] text-gray-300 text-sm md:text-base lg:text-xl mx-auto lg:mx-0"
              >
                Custom solutions that off-the-shelf software can't provide. We are your local experts for business technology.
              </p>
              <p
                class="max-w-[600px] text-gray-300 text-sm md:text-base lg:text-xl mx-auto lg:mx-0"
              >
                Specializing in custom web applications, proactive managed I.T. services, and professional network/camera installations across Gwinnett County.
              </p>
            </div>
            <div
              class="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start"
            >
              <a
                href="/home-improvement"
                class="glassmorphic-btn inline-flex items-center justify-center px-4 py-2 rounded-md text-sm md:text-base flex-1 sm:flex-none"
                on:click={() =>
                  track("Hero CTA Click", {
                    button: "Custom SmartHomes and Businesses",
                  })}
              >
                Custom SmartHomes and Businesses
              </a>
              <button
                class="get-in-touch-btn glassmorphic-btn inline-flex items-center justify-center px-4 py-2 rounded-md text-sm md:text-base flex-1 sm:flex-none"
                on:click={() => {
                  track("Hero CTA Click", { button: "Get a Free Quote" });
                  handleGetFreeQuote();
                }}
              >
                Get a Free Quote
              </button>
            </div>
          </div>
          <div
            class="mx-auto lg:mr-0 relative flex items-center justify-center"
            in:scaleIn={{ delay: 400 }}
          >
            <AISpotlightHero />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="w-full py-8 md:py-12 lg:py-24">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.services}
          <div
            class="flex flex-col items-center justify-center space-y-4 text-center"
            in:fadeIn
          >
            <div class="space-y-2">
              <div
                class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
              >
                Gwinnett's Premier Tech Partner
              </div>
              <h2
                class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter glow-text text-white drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]"
              >
                App Development, IT Services & Networking
              </h2>
              <p
                class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl"
              >
                As Gwinnett County's trusted technology partner, we provide cutting-edge custom applications, proactive managed IT services, and secure network / camera installations to help local businesses thrive.
              </p>
            </div>
          </div>
          <div
            class="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 justify-items-center"
          >
            <!-- Custom Website Development -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 0 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <path d="M12 20h9"></path>
                    <path
                      d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                    ></path>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  Custom Website Development
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500">
                  Professional web development services tailored for Gwinnett
                  County businesses, from small startups to established
                  enterprises.
                </p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">Responsive web design</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">Local SEO optimization</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">E-commerce integration</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Local SEO & Marketing -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 1 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <path
                      d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"
                    ></path>
                    <path d="M8.5 8.5v.01"></path>
                    <path d="M16 15.5v.01"></path>
                    <path d="M12 12v.01"></path>
                    <path d="M11 17v.01"></path>
                    <path d="M7 14v.01"></path>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  Local SEO & Marketing
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500">
                  Boost your visibility in Gwinnett County and Metro Atlanta
                  with targeted local SEO and marketing strategies.
                </p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">Google Business Profile</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">Local directory listings</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm">Content marketing</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hardware Installation and Maintenance -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 2 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <rect width="20" height="8" x="2" y="2" rx="2" ry="2"
                    ></rect>
                    <rect width="20" height="8" x="2" y="14" rx="2" ry="2"
                    ></rect>
                    <line x1="6" x2="6.01" y1="6" y2="6"></line>
                    <line x1="6" x2="6.01" y1="18" y2="18"></line>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  Hardware Installation and Maintenance
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500">
                  Professional hardware setup and ongoing maintenance for your
                  business infrastructure, from networking to servers.
                </p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >UniFi networking and security physical installations</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Hardware repairs and software monitoring for desktop and
                      server</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Printer installation and configuration</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Integration & Document Processing -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 3 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <path
                      d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2Z"
                    ></path>
                    <path d="M14 13h2"></path>
                    <path d="M14 17h2"></path>
                    <path d="M8 13h2"></path>
                    <path d="M8 17h2"></path>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  AI Integration, Local and Secure Document Processing for Large
                  Language Models
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500">
                  Harness the power of AI with secure, local document processing
                  solutions tailored to your business needs.
                </p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Customizable hardware packages for any budget</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Tools set up and customized for your business's document
                      types</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >OCR (optical character recognition) applications allow
                      your team to chat with all your business documents -
                      offline, locally, and secure</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Software Administration & Managed Services -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 4 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <path
                      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    ></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" x2="12" y1="22.08" y2="12"></line>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  Business Software Administration & Managed Services
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500 mb-3">
                  Comprehensive managed services with dedicated helpdesk support
                  for your essential business software platforms.
                </p>
                <div class="text-xs font-semibold text-teal-700 mb-2">
                  Supported Platforms:
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Autodesk</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Office 365</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Adobe Creative Cloud</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Toast</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Square</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >Clover</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-200"
                    >QuickBooks</span
                  >
                </div>
              </div>
            </div>

            <!-- Social Media & Digital Storefront Management -->
            <div
              class="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-2 group"
              in:fadeIn={{ delay: 5 * 100 }}
            >
              <div class="p-6 pb-2">
                <div
                  class="mb-2 rounded-full w-12 h-12 flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-6 w-6 text-teal-700 group-hover:text-teal-800 transition-colors duration-300"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                  </svg>
                </div>
                <h3
                  class="text-xl font-semibold group-hover:text-teal-700 transition-colors duration-300"
                >
                  Social Media & Digital Storefront Management
                </h3>
              </div>
              <div class="p-6">
                <p class="text-sm text-gray-500">
                  Build and maintain your online presence with professional
                  social media and Google Business Profile management, plus
                  custom applications for a unique digital storefront.
                </p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Social media management and content strategy</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Google Business Profile optimization and management</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm"
                      >Custom applications for unique digital storefronts</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- About Section -->
    <section
      id="about"
      class="w-full py-8 md:py-12 lg:py-24 bg-transparent md:backdrop-blur-sm bg-white/10 dark:bg-black/10"
    >
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.about}
          <div
            class="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-center justify-center"
            in:fadeIn
          >
            <!-- Left Side: Profile & Overview -->
            <div
              class="space-y-6 text-center lg:text-left bg-gradient-to-br from-teal-900/40 to-slate-900/50 p-8 rounded-2xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden group"
            >
              <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div class="relative mx-auto lg:mx-0 w-[200px] h-[200px] md:w-[240px] md:h-[240px] mb-6" in:scaleIn={{ delay: 200 }}>
                <div class="absolute inset-0 rounded-full border-2 border-teal-500/30 animate-[spin_10s_linear_infinite]"></div>
                <div class="absolute inset-2 rounded-full border border-blue-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                <img
                  src="/newProfile.png"
                  alt="Tech Partner - Professional Headshot"
                  class="rounded-full object-cover w-full h-full p-3 glow-image shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                  on:error={(e) => handleImageError(e, "profile")}
                  on:load={() => handleImageLoad("profile")}
                />
              </div>

              <div
                class="inline-block rounded-full bg-teal-500/20 border border-teal-500/30 px-4 py-1.5 text-sm text-teal-300 font-medium tracking-wide backdrop-blur-sm shadow-inner"
              >
                Gwinnett • Hall • Fulton
              </div>
              <h2
                class="text-3xl md:text-4xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-tight"
              >
                Your One-Stop <span class="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent drop-shadow-none glow-text">Tech Partner</span>
              </h2>
              <p
                class="text-gray-300 text-sm md:text-base leading-relaxed"
              >
                Positioned right here in Gwinnett County, I am your premier one-stop-shop for any upcoming large tech project. Whether you're scaling an SMB, need sophisticated digital infrastructure, or seeking an autonomous workforce edge—I build solutions that off-the-shelf software simply can't touch.
              </p>
            </div>

            <!-- Right Side: Bento Box Services Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-4 lg:mt-0 z-10 relative">
              
              <!-- Card 1 -->
              <div class="group bg-card/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-teal-500/40 hover:bg-white/5 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                <div class="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-400">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">Custom Apps & Data</h3>
                <p class="text-sm text-gray-400 leading-relaxed">
                  Help any SMB with tailored application development and complex data ingestion pipelines built for extreme performance.
                </p>
              </div>

              <!-- Card 2 -->
              <div class="group bg-card/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-blue-500/40 hover:bg-white/5 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400">
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Agentic AI Employees</h3>
                <p class="text-sm text-gray-400 leading-relaxed">
                  Create locally-hosted, offline chat agents and specialized AI employees engineered to execute secure work autonomously.
                </p>
              </div>

              <!-- Card 3 -->
              <div class="group bg-card/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-emerald-500/40 hover:bg-white/5 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">Managed IT Strategy</h3>
                <p class="text-sm text-gray-400 leading-relaxed">
                  Proactive MSP services, meticulous hardware monitoring, and expert recommendations on the best software packages.
                </p>
              </div>

              <!-- Card 4 -->
              <div class="group bg-card/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-purple-500/40 hover:bg-white/5 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 transform hover:-translate-y-1">
                <div class="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Employee Training</h3>
                <p class="text-sm text-gray-400 leading-relaxed">
                  Comprehensive onboarding and upskilling sessions to empower your team and maximize your new technological investments.
                </p>
              </div>

              <!-- Card 5 (Project Management - Full Width) -->
              <div class="group bg-card/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:border-amber-500/40 hover:bg-white/5 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-6">
                <div class="w-12 h-12 min-w-[3rem] rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 12 12 17 22 12"></polyline>
                    <polyline points="2 17 12 22 22 17"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">Technical Project Management</h3>
                  <p class="text-sm text-gray-400 leading-relaxed">
                    End-to-end oversight and strategic execution of complex technology deployments, ensuring your projects are delivered on time, under budget, and perfectly aligned with your business goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Home Assistant Section -->
    <section
      id="homeAssistant"
      class="w-full py-8 md:py-12 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.homeAssistant}
          <div class="grid gap-12 lg:grid-cols-2 items-center">
            <!-- Content -->
            <div class="space-y-6" in:slideIn={{ direction: "left" }}>
              <div class="space-y-4">
                <div
                  class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
                >
                  Complete Infrastructure Solutions
                </div>
                <h2
                  class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter glow-text"
                >
                  Building Management, Smart Automations & Local Control
                </h2>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Transform your operations with custom application development, autonomous AI employees, and complete physical automation. Everything runs locally, fully secure and entirely under your control.
                </p>
              </div>

              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-teal-600"
                    >
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      Custom App & IT Solutions
                    </h3>
                    <p class="text-gray-600 text-sm">
                      Scalable application development alongside unbreakable local network deployments
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-teal-600"
                    >
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      Agentic AI Workflows
                    </h3>
                    <p class="text-gray-600 text-sm">
                      Deploy secure, locally-hosted AI models to automate your heavy operational workloads
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-teal-600"
                    >
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Complete Facility Control</h3>
                    <p class="text-gray-600 text-sm">
                      Unified physical automation of lights, security, and climate through Home Assistant
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <a
                  href="/home-improvement"
                  class="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
                  on:click={() =>
                    track("Home Assistant CTA Click", { button: "Learn More" })}
                >
                  Learn More
                </a>
                <button
                  class="inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-medium rounded-lg transition-colors duration-200"
                  on:click={() => {
                    track("Home Assistant CTA Click", { button: "Get Quote" });
                    handleGetFreeQuote();
                  }}
                >
                  Get Free Quote
                </button>
              </div>
            </div>

            <!-- Dynamic Sentry-style Service Animation -->
            <div
              class="relative flex justify-center w-full"
              in:scaleIn={{ delay: 200 }}
            >
               <DynamicServiceDemo />
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="w-full py-8 md:py-12 lg:py-24">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.portfolio}
          <div in:fadeIn>
            <PortfolioBento />
          </div>
        {/if}
      </div>
    </section>

    <!-- FAQ Section -->
    <FAQ faqs={homeFaqs} />

    <!-- Contact Section -->
    <section id="contact" class="w-full py-8 md:py-12 lg:py-24 bg-gray-50">
      <div class="container px-4 md:px-6 mx-auto">
        {#if visibleSections.contact}
          <div
            class="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            in:fadeIn
          >
            <div class="space-y-2">
              <div
                class="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
              >
                Get In Touch
              </div>
              <h2
                class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter glow-text"
              >
                Ready to Start Your Project?
              </h2>
              <p
                class="max-w-[900px] text-gray-500 text-sm md:text-base lg:text-xl"
              >
                Let's discuss your vision and create something amazing together.
                I'm here to help bring your ideas to life.
              </p>
            </div>
          </div>

          <div
            class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          >
            <!-- Contact Card 1 -->
            <div
              class="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              in:fadeIn={{ delay: 200 }}
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-teal-600"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Call Me</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Let's discuss your project over the phone. I'm always happy to
                chat about new opportunities.
              </p>
              <a
                href="tel:470-962-1059"
                class="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
                on:click={() =>
                  track("Contact Clicked", { method: "phone", page: "Home" })}
              >
                (470) 962-1059
              </a>
            </div>

            <!-- Contact Card 2 -->
            <div
              class="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              in:fadeIn={{ delay: 400 }}
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-teal-600"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    ></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Email Me</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Send me a detailed message about your project. I'll get back to
                you within 24 hours.
              </p>
              <a
                href="mailto:contact@techieneighbor.net"
                class="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
                on:click={() =>
                  track("Contact Clicked", { method: "email", page: "Home" })}
              >
                contact@techieneighbor.net
              </a>
            </div>

            <!-- Contact Card 3 -->
            <div
              class="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1"
              in:fadeIn={{ delay: 600 }}
            >
              <div class="flex items-center space-x-3 mb-4">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-teal-600"
                  >
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    ></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold">Send Message</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Have a question or want to discuss your project? Send me a
                message and I'll get back to you quickly.
              </p>

              <form method="POST" class="space-y-4" on:submit={handleSubmit}>
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Name *</label
                  >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Email *</label
                  >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Message *</label
                  >
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Tell me about your project or question..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  class="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        {/if}
      </div>
    </section>
  </main>

  <!-- Klaviyo Newsletter Signup -->
  <section
    class="w-full py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-teal-200"
  >
    <div class="container px-4 md:px-6 mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with Tech Tips & Local Business Insights
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the latest web development tips, local business strategies, and
            tech insights delivered to your inbox.
          </p>
        </div>
        <div class="klaviyo-form-X92dvk"></div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-900 text-white py-12">
    <div class="container px-4 md:px-6 mx-auto">
      <div
        class="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center lg:text-left"
      >
        <!-- Company Info -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 justify-center lg:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-6 w-6 text-teal-400"
            >
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
              <line x1="6" x2="6" y1="6" y2="6"></line>
              <line x1="6" x2="6" y1="18" y2="18"></line>
            </svg>
            <span class="text-xl font-bold">TechieNeighbor</span>
          </div>
          <p class="text-gray-400 text-sm">
            Gwinnett's premier web developer, creating custom websites that help
            local businesses grow and succeed online.
          </p>
          <div class="flex space-x-4 justify-center lg:justify-start">
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-teal-400 transition-colors"
              on:click={() =>
                trackLinkClick(
                  "LinkedIn",
                  "https://linkedin.com/in/your-profile",
                  "footer",
                )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-teal-400 transition-colors"
              on:click={() =>
                trackLinkClick(
                  "GitHub",
                  "https://github.com/your-username",
                  "footer",
                )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Services</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#services" class="hover:text-teal-400 transition-colors"
                >Custom Website Development</a
              >
            </li>
            <li>
              <a href="#services" class="hover:text-teal-400 transition-colors"
                >Local SEO & Marketing</a
              >
            </li>
            <li>
              <a href="/services/networking-camera-installation" class="hover:text-teal-400 transition-colors"
                >Networking and Camera Installations</a
              >
            </li>
            <li>
              <a href="#services" class="hover:text-teal-400 transition-colors"
                >E-commerce Solutions</a
              >
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Quick Links</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#about" class="hover:text-teal-400 transition-colors"
                >About</a
              >
            </li>
            <li>
              <a href="#portfolio" class="hover:text-teal-400 transition-colors"
                >Portfolio</a
              >
            </li>
            <li>
              <a href="#contact" class="hover:text-teal-400 transition-colors"
                >Contact</a
              >
            </li>
            <li>
              <a
                href="/privacy-policy"
                class="hover:text-teal-400 transition-colors">Privacy Policy</a
              >
            </li>
            <li>
              <a
                href="/terms-of-service"
                class="hover:text-teal-400 transition-colors"
                >Terms of Service</a
              >
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Contact</h3>
          <div class="space-y-2 text-sm text-gray-400">
            <p>Gwinnett County, Georgia</p>
            <p>
              <a
                href="tel:470-962-1059"
                class="hover:text-teal-400 transition-colors">(470) 962-1059</a
              >
            </p>
            <p>
              <a
                href="mailto:contact@techieneighbor.net"
                class="hover:text-teal-400 transition-colors"
                >contact@techieneighbor.net</a
              >
            </p>
          </div>

          <!-- Cookie Notice -->
          {#if showCookieNotice}
            <div class="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div class="flex items-center gap-2 text-xs text-gray-300">
                <svg
                  class="w-4 h-4 text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>We use cookies to enhance your experience</span>
                <button
                  on:click={dismissCookieNotice}
                  class="text-teal-400 hover:text-teal-300 text-xs underline"
                >
                  Got it
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-sm text-gray-400">
          © {new Date().getFullYear()} TechieNeighbor. All rights reserved. |
          <a
            href="/privacy-policy"
            class="hover:text-teal-400 transition-colors ml-1">Privacy Policy</a
          >
          |
          <a
            href="/terms-of-service"
            class="hover:text-teal-400 transition-colors ml-1"
            >Terms of Service</a
          >
        </p>
      </div>
    </div>
  </footer>

  <!-- Toast Notification -->
  {#if showToast}
    <div
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      in:fadeIn
      out:fadeIn
    >
      {toastMessage}
    </div>
  {/if}

  <!-- Contact Modal -->
  {#if showContactModal}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      on:click={closeContactModal}
      on:keydown={(e) => e.key === 'Escape' && closeContactModal()}
      role="presentation"
      in:fadeIn
    >
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div
        class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
        on:click|stopPropagation
        on:keydown|stopPropagation
        role="dialog"
        aria-modal="true"
        in:scaleIn
      >
        <!-- Close button -->
        <button
          on:click={closeContactModal}
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Modal header -->
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-teal-600"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold">Send Message</h3>
        </div>
        <p class="text-gray-600 mb-4 text-sm">
          Have a question or want to discuss your project? Send me a message and
          I'll get back to you quickly.
        </p>

        <!-- Contact form -->
        <form method="POST" class="space-y-4" on:submit={handleSubmit}>
          <div>
            <label
              for="modal-name"
              class="block text-sm font-medium text-gray-700 mb-1">Name *</label
            >
            <input
              type="text"
              id="modal-name"
              name="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              for="modal-email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email *</label
            >
            <input
              type="email"
              id="modal-email"
              name="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              for="modal-message"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Message *</label
            >
            <textarea
              id="modal-message"
              name="message"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Tell me about your project or question..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  {/if}

  <!-- Hidden element to ensure CSS selector is recognized -->
  <div class="glassmorphic-btn halo-animate" style="display: none;"></div>
</div>

<style>
  /* Glassmorphic button base */
  .glassmorphic-btn {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #14b8a6 !important; /* Teal green to match the logo */
    font-weight: 600 !important;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); /* Darker text shadow for contrast */
  }

  .glassmorphic-btn:hover {
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    transform: translateY(-2px);
    color: #0d9488 !important; /* Darker teal on hover */
    background: rgba(
      255,
      255,
      255,
      0.2
    ) !important; /* Slightly more opaque on hover */
  }

  .glassmorphic-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.12) !important;
  }

  /* Animated halo effect */
  .glassmorphic-btn::before {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 9999px;
    border: 2.5px solid #14b8a6;
    opacity: 0;
    filter: blur(4px);
    z-index: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    transform: scale(0.8);
  }

  .glassmorphic-btn:hover::before {
    opacity: 0.6;
    transform: scale(1);
  }

  .glassmorphic-btn.halo-animate::before {
    animation: halo-pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes halo-pulse {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }

  /* Mobile-specific improvements */
  @media (max-width: 768px) {
    .glassmorphic-btn {
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      color: #14b8a6 !important; /* Teal green for mobile consistency */
      font-weight: 700 !important; /* Extra bold on mobile */
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4); /* Stronger text shadow on mobile */
      border-width: 2px !important; /* Slightly thicker border on mobile */
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* Faster animation on mobile */
    }

    .glassmorphic-btn:hover {
      color: #0d9488 !important; /* Darker teal on hover for mobile */
      background: rgba(255, 255, 255, 0.25) !important;
      transform: translateY(-1px); /* Smaller movement on mobile */
      box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.15) !important;
    }

    .glassmorphic-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
    }

    .glassmorphic-btn::before {
      inset: -6px;
      border-width: 2px;
      filter: blur(3px);
    }

    .glassmorphic-btn:hover::before {
      opacity: 0.7;
    }

    .glassmorphic-btn.halo-animate::before {
      animation: halo-pulse-mobile 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Mobile navbar button specific styles */
    .get-in-touch-btn {
      height: 32px !important; /* Ensure consistent height on mobile */
      min-height: 32px !important;
      line-height: 1 !important;
      white-space: nowrap !important;
      font-size: 11px !important; /* Smaller font size for mobile navbar */
      padding: 4px 8px !important; /* Reduced padding for mobile */
      border-radius: 6px !important; /* Slightly smaller border radius */
    }

    /* Ensure the button doesn't overflow the navbar */
    header .container .get-in-touch-btn {
      max-height: 40px !important;
      margin: auto 0 !important;
    }
  }

  @keyframes halo-pulse-mobile {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.05);
    }
    100% {
      opacity: 0;
      transform: scale(1.1);
    }
  }

  /* Ensure buttons are clickable */
  .glassmorphic-btn:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .glassmorphic-btn {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .glassmorphic-btn:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
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
    content: "";
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

  /* Conditional color for dark backgrounds */
  .is-dark-bg .nav-link {
    color: #e0fdfa;
  }
  .is-dark-bg .nav-link:hover {
    color: #5eead4;
  }

  /* Responsive navbar styles */
  nav.collapsed {
    display: none !important;
  }

  /* Mobile navigation link styles */
  .mobile-nav-link {
    color: #14b8a6 !important; /* Bright teal */
    text-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
    transition: all 0.3s ease;
    position: relative;
  }

  .mobile-nav-link:hover {
    color: #0d9488 !important; /* Darker teal on hover */
    text-shadow: 0 0 12px rgba(20, 184, 166, 0.6);
    transform: translateX(4px);
  }

  .mobile-nav-link:active {
    color: #0f766e !important; /* Even darker teal when active */
    text-shadow: 0 0 16px rgba(20, 184, 166, 0.8);
    transform: translateX(6px);
  }

  /* Ensure mobile menu button shows when navbar is collapsed */
  @media (min-width: 768px) {
    /* Mobile menu button and navigation are handled by Svelte's conditional classes */
  }

  /* Technologies carousel animation */
  /* Removed .animate-scroll and @keyframes scroll as they are no longer used */
</style>
