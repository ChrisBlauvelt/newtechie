# Implementation Plan

- [x] 1. Create restaurant pricing page route and basic structure
  - Create `/src/routes/pricing/restaurant/+page.svelte` file
  - Add script section with imports (onMount, fadeIn, slideIn, track)
  - Add svelte:head section with SEO meta tags
  - Set up basic page structure with header, main, and footer sections
  - _Requirements: 1.1, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Implement pricing tier data model and state management
  - Define pricingTiers array with three tiers (Essential, Hometown Hero, Scale to the Moon)
  - Include all tier properties: name, price, description, features, highlighted
  - Set up visibleSections reactive state object
  - Add analytics tracking functions (trackPricingCardHover, trackCTAClick, trackNavigationClick)
  - _Requirements: 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ]* 2.1 Write property test for complete tier information rendering
  - **Property 1: Complete tier information rendering**
  - **Validates: Requirements 1.3**

- [ ]* 2.2 Write property test for tier inheritance prefix
  - **Property 2: Tier inheritance prefix**
  - **Validates: Requirements 2.4**

- [x] 3. Build header section with navigation
  - Implement sticky header with logo and brand name
  - Add desktop navigation menu with links to Services, About, Portfolio, Pricing, Home Improvement, Contact
  - Add mobile menu button with hamburger icon
  - Add "Get in Touch" CTA button with phone link
  - Apply consistent styling with teal colors and hover effects
  - _Requirements: 3.1, 3.2, 9.3_

- [ ]* 3.1 Write property test for brand color usage
  - **Property 4: Brand color usage**
  - **Validates: Requirements 3.2**

- [ ]* 3.2 Write property test for navigation link tracking
  - **Property 9: Navigation link tracking**
  - **Validates: Requirements 5.3**

- [x] 4. Create hero section with page title and description
  - Add hero section with gradient background (slate-900 to slate-800)
  - Add main heading "Restaurant Digital Services & Website Management"
  - Add descriptive subtitle about professional services for restaurants
  - Apply fadeIn animation when section becomes visible
  - _Requirements: 1.5, 6.4_

- [x] 5. Implement pricing cards section
  - Create pricing cards container with responsive grid layout
  - Use {#each} block to iterate over pricingTiers array
  - Render each card with name, price, description, and features list
  - Apply highlighted styling to "Hometown Hero" tier
  - Add hover effects (shadow, scale, translate) to all cards
  - Add checkmark icons for each feature item
  - Implement staggered animation delays for cards
  - _Requirements: 1.2, 1.3, 1.4, 2.5, 3.3, 6.2_

- [ ]* 5.1 Write property test for feature icon consistency
  - **Property 3: Feature icon consistency**
  - **Validates: Requirements 2.5**

- [ ]* 5.2 Write property test for hover effect application
  - **Property 5: Hover effect application**
  - **Validates: Requirements 3.3**

- [ ]* 5.3 Write property test for pricing card hover tracking
  - **Property 8: Pricing card hover tracking**
  - **Validates: Requirements 5.2**

- [ ]* 5.4 Write property test for staggered card animation delays
  - **Property 11: Staggered card animation delays**
  - **Validates: Requirements 6.2**

- [x] 6. Add footer notes section
  - Create footer notes section below pricing cards
  - Add text: "All pricing is per location"
  - Add text about custom pricing for 5+ locations
  - Add text about setup fees
  - Add call to action to contact for personalized quotes
  - Center text and apply muted foreground color
  - Apply slide-in animation when visible
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 6.5_

- [x] 7. Implement responsive design for all breakpoints
  - Add mobile styles (single column layout for cards)
  - Add tablet styles (grid layout for cards)
  - Add desktop styles (three-column layout for cards)
  - Add responsive text sizing (text-sm, md:text-base, lg:text-xl)
  - Add responsive padding and spacing
  - Implement mobile menu toggle functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 7.1 Write property test for responsive class application
  - **Property 7: Responsive class application**
  - **Validates: Requirements 4.4**

- [ ]* 7.2 Write unit tests for responsive breakpoints
  - Test mobile viewport shows single column
  - Test tablet viewport shows grid layout
  - Test desktop viewport shows three columns
  - Test mobile menu button visibility
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 8. Set up Intersection Observer for scroll animations
  - Initialize Intersection Observer in onMount hook
  - Set threshold to 0.1
  - Observe all sections with IDs
  - Update visibleSections state when sections become visible
  - Apply fadeIn animation to sections based on visibility state
  - _Requirements: 6.1, 6.3_

- [ ]* 8.1 Write property test for section animation application
  - **Property 10: Section animation application**
  - **Validates: Requirements 6.1**

- [ ]* 8.2 Write unit test for Intersection Observer configuration
  - Verify threshold is set to 0.1
  - _Requirements: 6.3_

- [x] 9. Implement analytics tracking
  - Track page view event on mount with page name and URL
  - Track pricing card hover events with tier name
  - Track navigation link clicks with destination
  - Track "Get in Touch" button clicks with location
  - Track section viewed events when sections become visible
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 9.1 Write unit tests for analytics events
  - Test page view event fires on mount
  - Test "Get in Touch" button click tracking
  - Test section viewed event tracking
  - _Requirements: 5.1, 5.4, 5.5_

- [ ] 10. Add footer with newsletter signup and copyright
  - Implement Klaviyo newsletter signup section
  - Add copyright notice
  - Add "Back to Home" link
  - Apply gradient background (teal-900 to teal-800)
  - _Requirements: 3.4_

- [ ] 11. Ensure typography consistency with main pricing page
  - Review main pricing page typography classes
  - Apply same font families, sizes, and weights to restaurant page
  - Verify headings use same classes (text-2xl, text-3xl, text-4xl, etc.)
  - Verify body text uses same classes
  - Verify button text uses same classes
  - _Requirements: 3.5_

- [ ]* 11.1 Write property test for typography consistency
  - **Property 6: Typography consistency**
  - **Validates: Requirements 3.5**

- [ ] 12. Add navigation link from main pricing page to restaurant pricing
  - Open `/src/routes/pricing/+page.svelte`
  - Add a prominent CTA or card linking to restaurant pricing
  - Use descriptive text: "View Restaurant-Specific Packages"
  - Add analytics tracking for the link click
  - Style consistently with existing page elements
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [ ]* 12.1 Write unit tests for navigation integration
  - Test link exists on main pricing page
  - Test link navigates to correct route
  - Test back link exists on restaurant page
  - Test navigation tracking fires
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 14. Write unit tests for page content
  - Test page renders with correct title
  - Test three pricing cards are rendered
  - Test "Hometown Hero" has highlighted styling
  - Test header displays correct title text
  - Test footer notes display correct text
  - Test Essential tier has 10 features
  - Test Hometown Hero has inheritance prefix
  - Test Scale to the Moon has inheritance prefix
  - _Requirements: 1.2, 1.4, 1.5, 2.1, 2.2, 2.3, 7.1, 7.2, 7.3, 7.4_

- [ ]* 15. Write unit tests for SEO metadata
  - Test page title is correct
  - Test canonical URL is present
  - Test Open Graph tags are present
  - Test Twitter Card tags are present
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement contact form modal component
  - Add modal state variables (showContactModal, formData, isSubmitting, submitStatus, errorMessage, modalSource)
  - Create modal overlay with backdrop blur and click-outside-to-close functionality
  - Create modal content container with form fields (name, email, message)
  - Add close button with X icon in top-right corner
  - Implement Escape key handler to close modal
  - Add scroll prevention when modal is open (set body overflow:hidden)
  - Restore scroll when modal closes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 17.1 Write property test for modal opens on Get Started button clicks
  - **Property 12: Modal opens on Get Started button clicks**
  - **Validates: Requirements 10.1**

- [ ]* 17.2 Write property test for modal contains required form fields
  - **Property 13: Modal contains required form fields**
  - **Validates: Requirements 10.3**

- [ ]* 17.3 Write property test for modal prevents background scrolling
  - **Property 14: Modal prevents background scrolling**
  - **Validates: Requirements 10.4**

- [ ]* 17.4 Write property test for modal closes on outside click or Escape key
  - **Property 15: Modal closes on outside click or Escape key**
  - **Validates: Requirements 10.5**

- [x] 18. Implement form submission logic
  - Create handleSubmit function that prevents default form behavior
  - Implement client-side validation (check for empty fields, valid email format)
  - Make POST request to /api/contact with form data and source "Restaurant Pricing Page"
  - Handle loading state (disable button, show "Sending..." text)
  - Handle success response (show success message, clear form after 2 seconds, close modal)
  - Handle error response (show error message, keep modal open, keep form data)
  - Handle network errors (show user-friendly error message)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 18.1 Write property test for valid submissions send complete emails
  - **Property 16: Valid submissions send complete emails**
  - **Validates: Requirements 11.1, 13.1, 13.2, 13.3, 13.4, 13.5**

- [ ]* 18.2 Write property test for successful submissions show success feedback
  - **Property 17: Successful submissions show success feedback**
  - **Validates: Requirements 11.2, 11.3**

- [ ]* 18.3 Write property test for failed submissions show error feedback
  - **Property 18: Failed submissions show error feedback**
  - **Validates: Requirements 11.4**

- [ ]* 18.4 Write property test for form submission shows loading state
  - **Property 19: Form submission shows loading state**
  - **Validates: Requirements 11.5**

- [ ]* 18.5 Write property test for invalid inputs are rejected with validation errors
  - **Property 20: Invalid inputs are rejected with validation errors**
  - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 19. Update "Get Started" buttons to open modal
  - Change "Get Started" button href from "/#contact" to button with click handler
  - Implement openModal function that sets showContactModal to true and tracks source
  - Pass tier name as source parameter to openModal
  - Track "Contact Modal Opened" event with tier name
  - _Requirements: 10.1, 14.1_

- [x] 20. Update "Contact us" link to open modal
  - Change "Contact us" link in footer notes from "/#contact" to button/link with click handler
  - Call openModal function with source "footer"
  - Track "Contact Modal Opened" event with source "footer"
  - _Requirements: 10.2, 14.1_

- [x] 21. Implement modal analytics tracking
  - Track "Contact Modal Opened" event when modal opens (include source)
  - Track "Contact Modal Closed" event when modal closes
  - Track "Contact Form Submitted" event on successful submission (include page source)
  - Track "Contact Form Error" event on submission failure (include error type)
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ]* 21.1 Write property test for modal interactions are tracked
  - **Property 21: Modal interactions are tracked**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**

- [x] 22. Style contact form modal
  - Apply Tailwind classes for modal overlay (fixed, inset-0, z-50, bg-black/50, backdrop-blur-sm)
  - Style modal content (bg-white, rounded-lg, shadow-xl, max-w-md, p-6)
  - Style form inputs (border, rounded, padding, focus states with teal accent)
  - Style submit button (bg-teal-600, hover:bg-teal-700, disabled state)
  - Style close button (absolute, top-4, right-4, hover effect)
  - Style success message (bg-green-50, text-green-800, border-green-200)
  - Style error message (bg-red-50, text-red-800, border-red-200)
  - Add responsive styles for mobile (full width on small screens)
  - _Requirements: 3.2, 4.4_

- [x] 23. Add modal accessibility features
  - Add role="dialog" and aria-modal="true" to modal
  - Add aria-label="Close contact form" to close button
  - Add labels or aria-labels to all form inputs
  - Add aria-live="polite" to success/error message containers
  - Implement focus trapping within modal when open
  - Return focus to trigger element when modal closes
  - Ensure all interactive elements are keyboard accessible
  - _Requirements: 10.5_

- [ ]* 23.1 Write unit tests for modal accessibility
  - Test modal has correct ARIA attributes
  - Test focus trapping works
  - Test Escape key closes modal
  - Test focus returns to trigger element

- [ ] 24. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 25. Write unit tests for contact form modal
  - Test modal is hidden by default
  - Test modal appears on "Get Started" click
  - Test modal appears on "Contact us" click
  - Test modal contains all form fields
  - Test clicking outside closes modal
  - Test Escape key closes modal
  - Test form validation errors display correctly
  - Test successful submission flow
  - Test error submission flow
  - Test analytics tracking for all modal interactions
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 14.1, 14.2, 14.3, 14.4_

- [ ] 26. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
