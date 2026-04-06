# Implementation Plan: AI Spotlight Component

## Overview

This implementation plan breaks down the AI Spotlight Component into incremental coding tasks. The component will replace the Rico's World Kitchen image in the hero section with an interactive AI chatbot powered by Vercel's AI SDK. Each task builds on previous work, with property-based tests integrated throughout to validate correctness early.

## Tasks

- [x] 1. Set up dependencies and project structure
  - Install Vercel AI SDK (`ai` package) and OpenAI SDK
  - Install fast-check for property-based testing
  - Install @testing-library/svelte and vitest testing utilities
  - Create directory structure: `src/lib/components/ai-spotlight/` and `src/lib/ai/`
  - _Requirements: All requirements (foundation)_

- [ ] 2. Create knowledge base module
  - [x] 2.1 Create knowledge base TypeScript interfaces and data structure
    - Create `src/lib/ai/knowledge-base.ts` with KnowledgeBase interface
    - Populate knowledge base with TechieNeighbor service information from product.md
    - Include all four core services with features, benefits, and examples
    - Add company information, brand identity, and contact details
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 2.2 Write unit tests for knowledge base structure
    - Test that all four service keys exist
    - Test that required fields are populated
    - Test that location information is present
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Create system prompt builder
  - [x] 3.1 Implement buildSystemPrompt function
    - Create `src/lib/ai/prompt-builder.ts`
    - Build system prompt from knowledge base structure
    - Include instructions for tone, response length, and fallback behavior
    - _Requirements: 2.2, 3.4_
  
  - [ ]* 3.2 Write unit tests for prompt builder
    - Test that prompt includes all service information
    - Test that prompt includes brand identity elements
    - Test that prompt includes contact information
    - _Requirements: 2.2, 3.4_

- [ ] 4. Create API route for AI chat
  - [x] 4.1 Implement /api/ai-chat/+server.ts endpoint
    - Create SvelteKit API route with POST handler
    - Integrate Vercel AI SDK with OpenAI
    - Implement streaming response using StreamingTextResponse
    - Include knowledge base context in system prompt
    - Add input validation (empty check, length limit)
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 4.2 Implement error handling in API route
    - Handle network errors with appropriate status codes
    - Handle rate limiting (429 errors)
    - Handle service unavailability (503 errors)
    - Return user-friendly error messages
    - _Requirements: 5.3_
  
  - [ ]* 4.3 Write property test for API request handling
    - **Property 3: Question submission triggers API request**
    - **Property 4: Knowledge base context included in API requests**
    - Generate random question strings and verify API behavior
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 4.4 Write unit tests for API error handling
    - Test validation errors (empty message, too long)
    - Test network error responses
    - Test rate limit handling
    - _Requirements: 5.3_

- [x] 5. Checkpoint - Ensure API route tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create ChatMessage component
  - [x] 6.1 Implement ChatMessage.svelte component
    - Create `src/lib/components/ai-spotlight/ChatMessage.svelte`
    - Accept message prop with role, content, timestamp
    - Style user messages differently from AI messages
    - Add markdown rendering for AI responses
    - Include timestamp display
    - _Requirements: 1.3_
  
  - [ ]* 6.2 Write unit tests for ChatMessage rendering
    - Test user message styling
    - Test AI message styling
    - Test markdown rendering
    - Test timestamp display
    - _Requirements: 1.3_

- [ ] 7. Create SuggestedQuestions component
  - [x] 7.1 Implement SuggestedQuestions.svelte component
    - Create `src/lib/components/ai-spotlight/SuggestedQuestions.svelte`
    - Accept questions array and onSelect callback props
    - Render questions as clickable chips with teal styling
    - Add hover and focus states
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ]* 7.2 Write property test for suggested question clicks
    - **Property 9: Suggested question clicks trigger submission**
    - Generate random question arrays and verify click behavior
    - _Requirements: 6.3_

- [ ] 8. Create ChatBubble component
  - [x] 8.1 Implement ChatBubble.svelte component
    - Create `src/lib/components/ai-spotlight/ChatBubble.svelte`
    - Add glassmorphic styling with teal colors
    - Implement pulse animation (2s infinite)
    - Add AI sparkle icon
    - Include tooltip: "Ask me about our services"
    - _Requirements: 1.1, 4.5_
  
  - [ ]* 8.2 Write unit tests for ChatBubble
    - Test initial render
    - Test click handler invocation
    - Test tooltip presence
    - _Requirements: 1.1_

- [ ] 9. Create main AISpotlight component
  - [x] 9.1 Implement AISpotlight.svelte with state management
    - Create `src/lib/components/ai-spotlight/AISpotlight.svelte`
    - Define component state interface (isExpanded, messages, isLoading, error, inputValue)
    - Implement toggleExpanded method
    - Implement message history state management
    - Add welcome message to initial state
    - _Requirements: 1.2, 5.4, 6.5_
  
  - [x] 9.2 Implement chat interface UI
    - Create expanded chat interface layout
    - Add header with title and close button
    - Add scrollable message container
    - Add input area with text field and send button
    - Apply glassmorphic styling consistent with brand
    - _Requirements: 1.3, 1.4_
  
  - [x] 9.3 Implement sendMessage functionality
    - Create sendMessage method that calls API route
    - Handle streaming response using AI SDK's useChat or custom fetch
    - Update message history with user and AI messages
    - Display loading indicator during API call
    - Clear input field after sending
    - _Requirements: 2.1, 2.3, 5.1_
  
  - [x] 9.4 Implement error handling in component
    - Catch network errors from API calls
    - Display user-friendly error messages
    - Maintain conversation history during errors
    - Allow retry without losing context
    - _Requirements: 5.3_
  
  - [ ]* 9.5 Write property test for state management
    - **Property 1: Chat bubble expansion toggles interface visibility**
    - **Property 8: Conversation history persists during session**
    - Generate random state transitions and message sequences
    - _Requirements: 1.2, 5.4_
  
  - [ ]* 9.6 Write property test for error handling
    - **Property 7: Network errors display user-friendly messages**
    - Generate random error conditions and verify graceful handling
    - _Requirements: 5.3_

- [x] 10. Checkpoint - Ensure component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Add responsive behavior
  - [x] 11.1 Implement responsive styling
    - Add mobile-specific styles (full-screen overlay on mobile)
    - Add tablet-specific styles (larger bubble, adjusted positioning)
    - Add desktop styles (fixed position, optimal size)
    - Test at breakpoints: <768px, 768-1024px, >1024px
    - _Requirements: 1.5_
  
  - [ ]* 11.2 Write property test for responsive behavior
    - **Property 2: Responsive behavior across viewport sizes**
    - Test component rendering at different viewport widths
    - _Requirements: 1.5_

- [ ] 12. Add analytics tracking
  - [x] 12.1 Implement analytics tracking for all interactions
    - Track chat interface open event
    - Track question submission with category (no PII)
    - Track successful response generation
    - Track error events
    - Use Vercel Analytics track() function
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 12.2 Write property test for analytics tracking
    - **Property 10: Analytics tracking for all interaction types**
    - Generate random interaction sequences and verify tracking calls
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 13. Add accessibility features
  - [ ] 13.1 Implement keyboard navigation
    - Add proper focus management for all interactive elements
    - Ensure Tab/Shift+Tab navigation works correctly
    - Add Enter key support for sending messages
    - Add Escape key support for closing chat
    - _Requirements: 8.1_
  
  - [ ] 13.2 Add ARIA labels and roles
    - Add aria-label to chat bubble button
    - Add role="dialog" to expanded chat interface
    - Add aria-label to input field and send button
    - Add aria-live region for new messages
    - _Requirements: 8.2, 8.4_
  
  - [ ]* 13.3 Write property test for keyboard navigation
    - **Property 11: Keyboard navigation maintains focus order**
    - Test Tab navigation through all interactive elements
    - _Requirements: 8.1_
  
  - [ ]* 13.4 Write property test for screen reader announcements
    - **Property 12: New messages announced to screen readers**
    - Verify ARIA live regions update with new messages
    - _Requirements: 8.4_
  
  - [ ]* 13.5 Write unit tests for accessibility
    - Test ARIA labels presence
    - Test color contrast ratios
    - Test zoom support up to 200%
    - _Requirements: 8.2, 8.3, 8.5_

- [ ] 14. Integrate component into hero section
  - [ ] 14.1 Replace Rico's World Kitchen image with AISpotlight component
    - Open `src/routes/+page.svelte`
    - Import AISpotlight component
    - Replace the image at line 499 with <AISpotlight />
    - Adjust positioning to maintain visual harmony
    - Ensure other hero elements remain unaffected
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ]* 14.2 Write integration tests for hero section
    - Test that AISpotlight component renders in hero section
    - Test that other hero elements remain functional
    - Test that component is visible on page load
    - _Requirements: 4.1, 4.3, 4.4_

- [ ] 15. Add environment configuration
  - [ ] 15.1 Configure environment variables
    - Add OPENAI_API_KEY to .env.local
    - Update .env.example with required variables
    - Document API key setup in README or setup guide
    - _Requirements: 2.1_
  
  - [ ] 15.2 Configure Vercel deployment settings
    - Update vercel.json with function timeout (30s for /api/ai-chat)
    - Ensure environment variables are set in Vercel dashboard
    - Test edge function compatibility
    - _Requirements: 2.1, 2.3_

- [ ] 16. Performance optimization
  - [ ] 16.1 Implement code splitting and lazy loading
    - Lazy load AI SDK when chat is first opened
    - Lazy load markdown renderer
    - Implement message virtualization for long conversations (>50 messages)
    - _Requirements: 5.5_
  
  - [ ] 16.2 Add performance monitoring
    - Track time to first response
    - Monitor bundle size impact
    - Verify page load time not negatively affected
    - _Requirements: 5.5_

- [ ] 17. Final checkpoint - End-to-end testing
  - [ ] 17.1 Manual testing checklist
    - Test complete conversation flow on desktop
    - Test complete conversation flow on mobile
    - Test error scenarios (network failure, rate limiting)
    - Test accessibility with keyboard only
    - Test with screen reader (VoiceOver or NVDA)
    - Verify analytics events in Vercel dashboard
    - _Requirements: All requirements_
  
  - [ ]* 17.2 Write property test for streaming behavior
    - **Property 5: Response streaming delivers incremental content**
    - Mock streaming API responses and verify incremental delivery
    - _Requirements: 2.3_
  
  - [ ]* 17.3 Write property test for loading indicator
    - **Property 6: Loading indicator appears promptly**
    - Verify loading state changes in same render cycle
    - _Requirements: 5.1_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The implementation follows an incremental approach: foundation → API → components → integration → optimization
- Checkpoints ensure validation at key milestones
- All analytics tracking uses existing Vercel Analytics infrastructure
- Component styling follows TechieNeighbor's glassmorphic design with teal brand colors
