# Design Document: Restaurant Digital Success Packages Page

## Overview

The Restaurant Digital Success Packages page is a new route (`/pricing/restaurant`) that presents three tiered pricing packages specifically tailored for restaurant businesses. The page follows the established TechieNeighbor design system, utilizing SvelteKit's file-based routing, Tailwind CSS for styling, and Vercel Analytics for tracking. The design emphasizes visual hierarchy, responsive layouts, and smooth animations to create an engaging user experience while maintaining brand consistency.

The page now includes a floating contact form modal that allows users to submit inquiries directly without leaving the page. The modal integrates with the existing Resend API infrastructure (from the resend-email-migration spec) to send emails via the `/api/contact` endpoint.

## Architecture

### Component Structure

The page follows SvelteKit's single-file component pattern:

```
src/routes/pricing/restaurant/+page.svelte
```

This component will contain:
- Script section: State management, lifecycle hooks, analytics tracking functions
- Markup section: HTML structure with Svelte directives
- Style section: Component-scoped CSS (minimal, as Tailwind handles most styling)

### Data Flow

1. **Static Data**: Pricing tier information (name, price, description, features) will be defined as a JavaScript array within the component
2. **Reactive State**: Visibility tracking for sections using Svelte's reactive declarations, modal open/close state, form submission state
3. **Event Handlers**: Functions for tracking user interactions (hovers, clicks, scrolls), modal open/close, form submission
4. **Lifecycle Management**: `onMount` hook for initializing Intersection Observer and tracking page views
5. **API Integration**: Form submission to `/api/contact` endpoint using fetch API, response handling for success/error states

### Routing

- Primary route: `/pricing/restaurant`
- Navigation from: `/pricing` (main pricing page)
- Navigation to: Home page sections via header links, contact form modal via CTA buttons
- API endpoint: `POST /api/contact` (existing endpoint from resend-email-migration spec)

## Components and Interfaces

### PricingCard Component (Inline)

Since the existing site uses inline components, we'll define pricing cards directly in the markup using Svelte's `{#each}` block.

**Structure:**
```svelte
{#each pricingTiers as tier, index}
  <div class="pricing-card" class:highlighted={tier.highlighted}>
    <!-- Card content -->
  </div>
{/each}
```

**Props (via array object):**
- `name`: string - Tier name (e.g., "Essential")
- `price`: string - Monthly price (e.g., "$299")
- `description`: string - Brief description of the tier
- `features`: string[] - Array of feature descriptions
- `highlighted`: boolean - Whether this tier should be visually emphasized

### Header Component (Reused)

The existing header pattern will be replicated with:
- Logo and brand name linking to home
- Desktop navigation menu (hidden on mobile)
- Mobile menu button (visible on mobile)
- "Get in Touch" CTA button

### Footer Component (Reused)

Standard footer with:
- Copyright notice
- Back to home link
- Klaviyo newsletter signup section

### Analytics Tracking Interface

**Functions:**
```javascript
trackPricingCardHover(tierName: string): void
trackCTAClick(action: string): void
trackNavigationClick(link: string): void
trackModalOpen(source: string): void
trackModalClose(): void
trackFormSubmit(success: boolean): void
```

### Contact Form Modal Component (Inline)

The contact form modal will be implemented as an inline component within the page using Svelte's conditional rendering.

**Structure:**
```svelte
{#if showContactModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <form on:submit|preventDefault={handleSubmit}>
        <!-- Form fields -->
      </form>
    </div>
  </div>
{/if}
```

**State:**
- `showContactModal`: boolean - Controls modal visibility
- `formData`: object - Stores name, email, message
- `isSubmitting`: boolean - Loading state during submission
- `submitStatus`: string - 'idle' | 'success' | 'error'
- `errorMessage`: string - Error message to display
- `modalSource`: string - Tracks what triggered the modal (tier name or 'footer')

**Methods:**
- `openModal(source: string)`: Opens modal and tracks event
- `closeModal()`: Closes modal and tracks event
- `handleSubmit()`: Validates and submits form data to `/api/contact`
- `resetForm()`: Clears form fields and resets state

## Data Models

### PricingTier Model

```typescript
interface PricingTier {
  name: string;           // "Essential", "Hometown Hero", "Scale to the Moon"
  price: string;          // "$299", "$399", "$599"
  description: string;    // Descriptive text about the tier
  features: string[];     // Array of feature descriptions
  highlighted: boolean;   // True for "Hometown Hero"
}
```

### VisibleSections Model

```typescript
interface VisibleSections {
  header: boolean;
  pricing: boolean;
  footer: boolean;
}
```

### Analytics Event Models

```typescript
interface PageViewEvent {
  page: string;
  url: string;
}

interface PricingCardHoverEvent {
  page: string;
  tierName: string;
}

interface CTAClickEvent {
  page: string;
  action: string;
  location: string;
}

interface ContactModalEvent {
  page: string;
  source: string;  // tier name or 'footer'
  action: 'opened' | 'closed' | 'submitted';
}
```

### Contact Form Data Models

```typescript
interface ContactFormData {
  name: string;        // 1-200 characters, trimmed
  email: string;       // Valid email format, 1-200 characters
  message: string;     // Non-empty after trim
  source: string;      // Page identifier: "Restaurant Pricing Page"
}

interface ContactFormState {
  showModal: boolean;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
  modalSource: string;
}

interface APIResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, the following properties have been identified as providing unique validation value. Many criteria are specific examples (testing exact content, specific breakpoints, or particular UI elements) rather than universal properties. The properties below represent rules that should hold across multiple instances or inputs.

**Property 1: Complete tier information rendering**

*For any* pricing tier in the data array, when rendered as a card, the card should display the tier's name, price, description, and all features from the feature list.

**Validates: Requirements 1.3**

**Property 2: Tier inheritance prefix**

*For any* pricing tier that includes features from a previous tier (where features array starts with "Everything in [tier name], plus:"), the rendered card should display this prefix as the first feature item.

**Validates: Requirements 2.4**

**Property 3: Feature icon consistency**

*For any* feature item in any pricing tier, when rendered, the feature should be accompanied by a checkmark or icon element.

**Validates: Requirements 2.5**

**Property 4: Brand color usage**

*For any* interactive element (buttons, links, hover states) on the page, the element should use teal color values (#14b8a6 or #0d9488) or their corresponding Tailwind classes (teal-600, teal-700).

**Validates: Requirements 3.2**

**Property 5: Hover effect application**

*For any* pricing card, when the hover state is active, the card should apply shadow, scale, and translate transformations via CSS classes.

**Validates: Requirements 3.3**

**Property 6: Typography consistency**

*For any* text element on the restaurant pricing page, the element should use the same Tailwind typography classes (font-family, font-size, font-weight) as equivalent elements on the main pricing page.

**Validates: Requirements 3.5**

**Property 7: Responsive class application**

*For any* element with responsive behavior, when the viewport width changes, the element should have Tailwind responsive classes (sm:, md:, lg:) that adjust its styling.

**Validates: Requirements 4.4**

**Property 8: Pricing card hover tracking**

*For any* pricing card, when a user hovers over the card, an analytics event should be tracked with event name "Pricing Card Hovered" and the tier name as a parameter.

**Validates: Requirements 5.2**

**Property 9: Navigation link tracking**

*For any* navigation link in the header, when clicked, an analytics event should be tracked with event name "Navigation Click" and the link destination as a parameter.

**Validates: Requirements 5.3**

**Property 10: Section animation application**

*For any* section with an ID that becomes visible in the viewport, the section should apply the fadeIn transition from animations.js.

**Validates: Requirements 6.1**

**Property 11: Staggered card animation delays**

*For any* set of pricing cards rendered in sequence, each card should have an animation delay that increases relative to its index position (e.g., card 0: 0ms, card 1: 100ms, card 2: 200ms).

**Validates: Requirements 6.2**

### Contact Form Modal Properties

**Property 12: Modal opens on Get Started button clicks**

*For any* "Get Started" button on any pricing card, when clicked, the contact form modal should open and display.

**Validates: Requirements 10.1**

**Property 13: Modal contains required form fields**

*For any* time the contact form modal is opened, the modal should display input fields for name, email, and message.

**Validates: Requirements 10.3**

**Property 14: Modal prevents background scrolling**

*For any* time the contact form modal is open, scrolling of the background page content should be prevented.

**Validates: Requirements 10.4**

**Property 15: Modal closes on outside click or Escape key**

*For any* contact form modal that is open, clicking outside the modal or pressing the Escape key should close the modal.

**Validates: Requirements 10.5**

**Property 16: Valid submissions send complete emails**

*For any* valid contact form submission (with valid name, email, and message), the email sent via Resend API should contain all three fields, include "Restaurant Pricing Page" in the subject line, set the from address to the configured email, set reply-to to the user's email, and use HTML formatting.

**Validates: Requirements 11.1, 13.1, 13.2, 13.3, 13.4, 13.5**

**Property 17: Successful submissions show success feedback**

*For any* successful form submission, the system should display a success message within the modal, then clear the form fields and close the modal after 2 seconds.

**Validates: Requirements 11.2, 11.3**

**Property 18: Failed submissions show error feedback**

*For any* form submission that encounters an error, the system should display an error message within the modal without closing it.

**Validates: Requirements 11.4**

**Property 19: Form submission shows loading state**

*For any* form submission in progress, the submit button should display a loading state.

**Validates: Requirements 11.5**

**Property 20: Invalid inputs are rejected with validation errors**

*For any* form submission with missing fields, invalid email format, whitespace-only message, or fields exceeding 200 characters, the system should reject the submission and display a validation error message.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

**Property 21: Modal interactions are tracked**

*For any* modal interaction (open, close, submit success, submit error), an analytics event should be tracked with appropriate event name and context data including the trigger source.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

## Error Handling

### Route Not Found

If a user navigates to an invalid sub-route under `/pricing/restaurant/`, SvelteKit's default 404 handling will apply. No custom error page is required for this feature.

### Missing Data

If the `pricingTiers` array is empty or undefined:
- The page should still render the header, hero section, and footer
- The pricing cards section should display a fallback message: "Pricing information is currently unavailable. Please contact us for details."
- Analytics should track an error event

### Contact Form Validation Errors

If form validation fails:
- Display inline error messages below the relevant field
- Keep the modal open so the user can correct errors
- Highlight invalid fields with red borders
- Track validation error events in analytics

Common validation errors:
- "All fields are required" - when any field is empty
- "Please provide a valid email address" - when email format is invalid
- "Message cannot be empty" - when message is only whitespace
- "Name/Email must be 200 characters or less" - when fields exceed limit

### Contact Form Submission Errors

If the API request fails:
- Display error message in modal: "Failed to send message. Please try again."
- Keep form data intact so user doesn't lose their message
- Re-enable submit button
- Track error event with error type
- Log detailed error to console for debugging

### Network Errors

If network connection fails:
- Display user-friendly message: "Network error. Please check your connection."
- Suggest trying again later
- Keep modal open with form data intact

### Analytics Failure

If Vercel Analytics fails to load or track events:
- The page should continue to function normally
- Console errors should be logged for debugging
- User experience should not be impacted

### Animation Failure

If the Intersection Observer API is not supported (older browsers):
- Sections should render without animations
- All content should remain visible and accessible
- No JavaScript errors should be thrown

### Responsive Breakpoint Edge Cases

If viewport width is exactly at a breakpoint boundary:
- Tailwind's mobile-first approach ensures consistent behavior
- The larger breakpoint's styles will apply
- No visual glitches should occur

### Modal Accessibility

If JavaScript is disabled:
- "Get Started" buttons should fall back to linking to `/#contact`
- "Contact us" link should navigate to `/#contact`
- Form functionality will not be available but users can still reach contact section

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

**Page Load Tests:**
- Verify the page renders with correct title and meta tags
- Verify three pricing cards are rendered
- Verify "Hometown Hero" card has highlighted styling
- Verify header section displays correct title text
- Verify footer notes display correct text content

**Content Tests:**
- Verify Essential tier displays exactly 10 features
- Verify Hometown Hero tier includes "Everything in Essential, plus:" prefix
- Verify Scale to the Moon tier includes "Everything in Hometown Hero, plus:" prefix
- Verify specific feature text appears in correct tiers

**Responsive Tests:**
- Verify mobile viewport (< 768px) shows single column layout
- Verify tablet viewport (768px - 1024px) shows grid layout
- Verify desktop viewport (> 1024px) shows three-column layout
- Verify mobile menu button appears on mobile
- Verify desktop navigation appears on desktop

**Analytics Tests:**
- Verify page view event fires on mount with correct parameters
- Verify "Get in Touch" button click fires tracking event
- Verify Intersection Observer threshold is set to 0.1

**SEO Tests:**
- Verify page title is "Restaurant Digital Success Packages | TechieNeighbor"
- Verify canonical URL is present and correct
- Verify Open Graph tags are present
- Verify Twitter Card tags are present

**Navigation Tests:**
- Verify link to restaurant pricing exists on main pricing page
- Verify back link to main pricing exists on restaurant page
- Verify navigation triggers route change

### Contact Form Modal Unit Tests

**Modal Rendering Tests:**
- Verify modal is hidden by default
- Verify modal appears when "Get Started" button is clicked
- Verify modal appears when "Contact us" link is clicked
- Verify modal contains name, email, and message input fields
- Verify modal contains submit button
- Verify modal contains close button

**Modal Interaction Tests:**
- Verify clicking outside modal closes it
- Verify pressing Escape key closes it
- Verify clicking close button closes it
- Verify background scroll is disabled when modal is open
- Verify background scroll is restored when modal closes

**Form Validation Tests:**
- Verify empty name shows validation error
- Verify empty email shows validation error
- Verify empty message shows validation error
- Verify invalid email format shows validation error
- Verify whitespace-only message shows validation error
- Verify name over 200 characters shows validation error
- Verify email over 200 characters shows validation error

**Form Submission Tests:**
- Verify valid form data submits to `/api/contact`
- Verify request includes page source "Restaurant Pricing Page"
- Verify submit button shows loading state during submission
- Verify success message appears on successful submission
- Verify form clears after successful submission
- Verify modal closes after successful submission
- Verify error message appears on failed submission
- Verify form data persists on failed submission
- Verify modal stays open on failed submission

**Analytics Tests:**
- Verify modal open event tracks trigger source
- Verify modal close event tracks
- Verify form submit success event tracks
- Verify form submit error event tracks with error type

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript property-based testing library). Each test will run a minimum of 100 iterations.

**Property Test 1: Complete tier information rendering**
- **Feature: restaurant-pricing-page, Property 1: Complete tier information rendering**
- Generate random pricing tier objects with name, price, description, and features
- Render each tier as a card component
- Assert that rendered HTML contains the name, price, description, and all feature items
- Validates: Requirements 1.3

**Property Test 2: Tier inheritance prefix**
- **Feature: restaurant-pricing-page, Property 2: Tier inheritance prefix**
- Generate random pricing tiers where some have "Everything in X, plus:" as first feature
- Render each tier
- Assert that tiers with inheritance prefix display it as the first feature item
- Validates: Requirements 2.4

**Property Test 3: Feature icon consistency**
- **Feature: restaurant-pricing-page, Property 3: Feature icon consistency**
- Generate random feature lists of varying lengths
- Render features in a card
- Assert that each feature item has an associated icon/checkmark element
- Validates: Requirements 2.5

**Property Test 4: Brand color usage**
- **Feature: restaurant-pricing-page, Property 4: Brand color usage**
- Generate random interactive elements (buttons, links)
- Render elements with styling
- Assert that elements use teal color classes (teal-600, teal-700) or hex values
- Validates: Requirements 3.2

**Property Test 5: Hover effect application**
- **Feature: restaurant-pricing-page, Property 5: Hover effect application**
- Generate random pricing card data
- Render cards with hover classes
- Assert that hover classes include shadow, scale, and translate transformations
- Validates: Requirements 3.3

**Property Test 6: Typography consistency**
- **Feature: restaurant-pricing-page, Property 6: Typography consistency**
- Generate random text elements (headings, paragraphs, labels)
- Compare typography classes between restaurant page and main pricing page
- Assert that equivalent elements use the same font classes
- Validates: Requirements 3.5

**Property Test 7: Responsive class application**
- **Feature: restaurant-pricing-page, Property 7: Responsive class application**
- Generate random responsive elements
- Parse element classes
- Assert that responsive elements have at least one responsive class (sm:, md:, lg:)
- Validates: Requirements 4.4

**Property Test 8: Pricing card hover tracking**
- **Feature: restaurant-pricing-page, Property 8: Pricing card hover tracking**
- Generate random pricing tier names
- Simulate hover events on cards
- Assert that analytics tracking function is called with correct event name and tier name
- Validates: Requirements 5.2

**Property Test 9: Navigation link tracking**
- **Feature: restaurant-pricing-page, Property 9: Navigation link tracking**
- Generate random navigation link destinations
- Simulate click events on links
- Assert that analytics tracking function is called with correct event name and destination
- Validates: Requirements 5.3

**Property Test 10: Section animation application**
- **Feature: restaurant-pricing-page, Property 10: Section animation application**
- Generate random section IDs
- Simulate sections becoming visible
- Assert that fadeIn transition is applied to each section
- Validates: Requirements 6.1

**Property Test 11: Staggered card animation delays**
- **Feature: restaurant-pricing-page, Property 11: Staggered card animation delays**
- Generate random arrays of pricing cards (varying lengths)
- Render cards with animation delays
- Assert that each card's delay is greater than the previous card's delay
- Assert that delay increments are consistent (e.g., 100ms per card)
- Validates: Requirements 6.2

### Contact Form Modal Property Tests

**Property Test 12: Modal opens on Get Started button clicks**
- **Feature: restaurant-pricing-page, Property 12: Modal opens on Get Started button clicks**
- Generate random pricing tier data
- Simulate click events on "Get Started" buttons
- Assert that modal opens and is visible
- Validates: Requirements 10.1

**Property Test 13: Modal contains required form fields**
- **Feature: restaurant-pricing-page, Property 13: Modal contains required form fields**
- Open modal multiple times
- Assert that name, email, and message input fields are present
- Validates: Requirements 10.3

**Property Test 14: Modal prevents background scrolling**
- **Feature: restaurant-pricing-page, Property 14: Modal prevents background scrolling**
- Open modal
- Assert that body element has overflow:hidden or similar scroll prevention
- Validates: Requirements 10.4

**Property Test 15: Modal closes on outside click or Escape key**
- **Feature: restaurant-pricing-page, Property 15: Modal closes on outside click or Escape key**
- Open modal
- Simulate click outside modal and Escape key press
- Assert that modal closes in both cases
- Validates: Requirements 10.5

**Property Test 16: Valid submissions send complete emails**
- **Feature: restaurant-pricing-page, Property 16: Valid submissions send complete emails**
- Generate random valid form data (names, emails, messages)
- Mock Resend API endpoint
- Submit form
- Assert email contains all fields, correct subject, from/reply-to headers, HTML format
- Validates: Requirements 11.1, 13.1, 13.2, 13.3, 13.4, 13.5

**Property Test 17: Successful submissions show success feedback**
- **Feature: restaurant-pricing-page, Property 17: Successful submissions show success feedback**
- Generate random valid form data
- Mock successful API response
- Submit form
- Assert success message appears, form clears after 2 seconds, modal closes
- Validates: Requirements 11.2, 11.3

**Property Test 18: Failed submissions show error feedback**
- **Feature: restaurant-pricing-page, Property 18: Failed submissions show error feedback**
- Generate random form data
- Mock API error response
- Submit form
- Assert error message appears and modal stays open
- Validates: Requirements 11.4

**Property Test 19: Form submission shows loading state**
- **Feature: restaurant-pricing-page, Property 19: Form submission shows loading state**
- Generate random form data
- Submit form
- Assert submit button shows loading state during submission
- Validates: Requirements 11.5

**Property Test 20: Invalid inputs are rejected with validation errors**
- **Feature: restaurant-pricing-page, Property 20: Invalid inputs are rejected with validation errors**
- Generate random invalid form data (missing fields, bad emails, whitespace, too long)
- Submit form
- Assert validation error message appears
- Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5

**Property Test 21: Modal interactions are tracked**
- **Feature: restaurant-pricing-page, Property 21: Modal interactions are tracked**
- Mock analytics tracking function
- Perform various modal interactions (open, close, submit, error)
- Assert correct analytics events are tracked with proper context
- Validates: Requirements 14.1, 14.2, 14.3, 14.4

### Integration Testing

Integration tests will verify the page works correctly within the full SvelteKit application:

- Test navigation from main pricing page to restaurant pricing page
- Test navigation from restaurant pricing page back to main pricing page
- Test that analytics events are properly sent to Vercel Analytics
- Test that Intersection Observer correctly triggers animations
- Test that responsive breakpoints work across different viewport sizes

### Manual Testing Checklist

- [ ] Verify visual consistency with existing TechieNeighbor pages
- [ ] Test hover effects on all interactive elements
- [ ] Test animations on scroll
- [ ] Verify mobile menu functionality
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Verify SEO tags in browser dev tools
- [ ] Test analytics tracking in Vercel dashboard

## Implementation Notes

### File Structure

```
src/routes/pricing/restaurant/
  +page.svelte          # Main page component with inline contact modal
src/routes/api/contact/
  +server.js            # Existing API endpoint (from resend-email-migration)
```

### Contact Form Modal Implementation

**Modal Structure:**
```svelte
{#if showContactModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
       on:click={closeModal}
       on:keydown={(e) => e.key === 'Escape' && closeModal()}>
    <div class="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6" 
         on:click|stopPropagation>
      <!-- Close button -->
      <button class="absolute top-4 right-4" on:click={closeModal}>×</button>
      
      <!-- Form -->
      <form on:submit|preventDefault={handleSubmit}>
        <input bind:value={formData.name} placeholder="Name" />
        <input bind:value={formData.email} type="email" placeholder="Email" />
        <textarea bind:value={formData.message} placeholder="Message"></textarea>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      <!-- Status messages -->
      {#if submitStatus === 'success'}
        <div class="success-message">Message sent successfully!</div>
      {/if}
      {#if submitStatus === 'error'}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
  </div>
{/if}
```

**Form Submission Handler:**
```javascript
async function handleSubmit() {
  isSubmitting = true;
  submitStatus = 'idle';
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        source: 'Restaurant Pricing Page'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      submitStatus = 'success';
      track('Contact Form Submitted', { page: 'Restaurant Pricing', source: modalSource });
      
      setTimeout(() => {
        resetForm();
        closeModal();
      }, 2000);
    } else {
      submitStatus = 'error';
      errorMessage = result.error || 'Failed to send message';
      track('Contact Form Error', { page: 'Restaurant Pricing', error: errorMessage });
    }
  } catch (error) {
    submitStatus = 'error';
    errorMessage = 'Network error. Please try again.';
    track('Contact Form Error', { page: 'Restaurant Pricing', error: 'network' });
  } finally {
    isSubmitting = false;
  }
}
```

**Scroll Prevention:**
```javascript
function openModal(source) {
  showContactModal = true;
  modalSource = source;
  document.body.style.overflow = 'hidden';
  track('Contact Modal Opened', { page: 'Restaurant Pricing', source });
}

function closeModal() {
  showContactModal = false;
  document.body.style.overflow = '';
  track('Contact Modal Closed', { page: 'Restaurant Pricing' });
}
```

### Styling Approach

- Use Tailwind utility classes for all styling
- Reuse existing color variables (teal-600, teal-700)
- Apply responsive classes (sm:, md:, lg:) for breakpoints
- Use existing animation patterns from animations.js
- Match spacing and typography from main pricing page
- Modal overlay: `bg-black/50 backdrop-blur-sm` for glassmorphic effect
- Modal content: `bg-white rounded-lg shadow-xl` for card appearance
- Form inputs: Consistent with site-wide form styling
- Success message: Green background with teal accent
- Error message: Red background with white text

### Animation Implementation

```javascript
// Use Intersection Observer for scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      visibleSections[entry.target.id] = true;
    }
  });
}, { threshold: 0.1 });
```

### Analytics Implementation

```javascript
// Track page view on mount
onMount(() => {
  track('Page View', {
    page: 'Restaurant Pricing',
    url: '/pricing/restaurant'
  });
});

// Track pricing card hover
function trackPricingCardHover(tierName) {
  track('Pricing Card Hovered', {
    page: 'Restaurant Pricing',
    tierName: tierName
  });
}
```

### Responsive Breakpoints

- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (grid layout)
- Desktop: > 1024px (three columns)

### Accessibility Considerations

- Use semantic HTML (header, main, section, footer, dialog)
- Include aria-labels for interactive elements
- Modal should have `role="dialog"` and `aria-modal="true"`
- Modal should trap focus within it when open
- Close button should have `aria-label="Close contact form"`
- Form inputs should have associated labels (visible or aria-label)
- Error messages should be announced to screen readers with `aria-live="polite"`
- Success messages should be announced with `aria-live="polite"`
- Ensure sufficient color contrast (WCAG AA)
- Support keyboard navigation (Tab, Shift+Tab, Escape)
- Provide focus indicators for interactive elements
- Use alt text for any images (if added later)
- Ensure modal can be closed with Escape key
- Return focus to trigger element when modal closes

### Performance Considerations

- Lazy load animations (only trigger when visible)
- Use CSS transforms for animations (GPU-accelerated)
- Minimize JavaScript bundle size (reuse existing utilities)
- Optimize images if added (WebP format with fallbacks)
- Leverage SvelteKit's built-in code splitting

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge) - full support
- Intersection Observer API - supported in all modern browsers
- Fallback for older browsers: render without animations
- CSS Grid - supported in all modern browsers
- Tailwind CSS - generates compatible CSS

### Future Enhancements

- Add comparison table view for side-by-side tier comparison
- Add FAQ section for common restaurant pricing questions
- Add testimonials from restaurant clients
- Add case studies or portfolio examples
- Add calculator tool for estimating costs based on restaurant size
- Add integration with booking/contact form for custom quotes
