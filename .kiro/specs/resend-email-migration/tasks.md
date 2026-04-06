# Implementation Plan: Resend Email Migration

- [x] 1. Set up Resend integration and documentation
  - [x] 1.1 Install Resend SDK and testing dependencies
    - Add `resend` package to dependencies
    - Add `vitest`, `fast-check`, and `@testing-library/svelte` to devDependencies
    - Update package.json and install packages
    - _Requirements: All (foundation for implementation)_

  - [x] 1.2 Create Resend setup documentation
    - Create `RESEND_SETUP.md` file with step-by-step instructions
    - Include account creation, API key generation, and domain verification steps
    - Document SPF record merging for ProtonMail compatibility
    - Include local and Vercel environment variable setup
    - Add testing and troubleshooting sections
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 1.3 Configure environment variables
    - Create `.env.local` file with required variables
    - Add `.env.local` to `.gitignore` if not already present
    - Document variable names: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
    - _Requirements: 3.1, 3.2, 3.5_

- [x] 2. Implement server-side contact form endpoint
  - [x] 2.1 Create API endpoint structure
    - Create `src/routes/api/contact/+server.js` file
    - Set up POST request handler
    - Import Resend SDK and configure with API key
    - Add error handling for missing API key configuration
    - _Requirements: 1.1, 3.1, 3.3, 3.4_

  - [x] 2.2 Implement input validation logic
    - Create validation function for form data
    - Validate required fields (name, email, message)
    - Implement email format validation with regex
    - Validate field length limits (200 chars for name/email)
    - Trim whitespace and reject whitespace-only messages
    - Return 400 errors with descriptive messages for validation failures
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 2.3 Write property test for validation
    - **Property 3: Invalid inputs are rejected with 400 errors**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5**

  - [x] 2.4 Implement email sending with Resend API
    - Create email template formatting function
    - Build HTML email body with user's name, email, and message
    - Set subject line with "Contact Form Submission from {name}"
    - Configure from address using `RESEND_FROM_EMAIL`
    - Set reply-to address to user's submitted email
    - Call Resend API to send email
    - Handle Resend API responses and errors
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.5 Write property test for email structure
    - **Property 1: Valid submissions produce complete emails**
    - **Validates: Requirements 1.1, 4.1, 4.2, 4.3, 4.4, 4.5**

  - [x] 2.6 Implement response handling
    - Return 200 success response with success message
    - Return appropriate error responses (400 for validation, 500 for server errors)
    - Sanitize error messages to prevent sensitive data exposure
    - _Requirements: 1.2, 2.3, 5.3_

  - [ ]* 2.7 Write property test for success responses
    - **Property 2: Successful email sends return success responses**
    - **Validates: Requirements 1.2**

  - [ ]* 2.8 Write property test for error sanitization
    - **Property 4: Error responses never expose sensitive information**
    - **Validates: Requirements 5.3**

  - [x] 2.9 Add error logging
    - Log all errors to server console with timestamps
    - Log successful submissions with recipient info
    - Ensure logs don't expose sensitive data
    - Add specific error messages for rate limiting, network errors, and API errors
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [x] 3. Update client-side form handling
  - [x] 3.1 Modify form submission handler
    - Update `handleSubmit` function in `src/routes/+page.svelte`
    - Change from Formspree URL to `/api/contact` endpoint
    - Convert FormData to JSON format
    - Set proper Content-Type header
    - Handle fetch errors and network issues
    - _Requirements: 1.1, 1.2_

  - [x] 3.2 Implement client-side success handling
    - Reset form fields on successful submission
    - Display success toast message
    - Trigger confetti animation (existing functionality)
    - Track successful submission with analytics
    - _Requirements: 1.3_

  - [ ]* 3.3 Write property test for form reset
    - **Property 5: Form UI resets after successful submission**
    - **Validates: Requirements 1.3**

  - [x] 3.4 Implement client-side error handling
    - Parse error responses from server
    - Display appropriate error messages to user
    - Maintain form field values on error
    - Re-enable submit button after error
    - Handle network errors gracefully
    - _Requirements: 1.4, 5.2_

  - [ ]* 3.5 Write property test for error display
    - **Property 6: Form UI shows errors after failed submission**
    - **Validates: Requirements 1.4**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Write unit tests for validation and formatting
  - [x] 5.1 Write unit tests for email validation
    - Test valid email formats (standard, with dots, with plus signs)
    - Test invalid email formats (missing @, multiple @, invalid domains)
    - _Requirements: 2.2_

  - [x] 5.2 Write unit tests for field validation
    - Test required field detection
    - Test field length validation (boundary cases at 200 chars)
    - Test whitespace trimming and rejection
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 5.3 Write unit tests for email template formatting
    - Test HTML email generation with various inputs
    - Test subject line formatting with different names
    - Test special character handling in email content
    - _Requirements: 4.1, 4.2, 4.5_

- [-] 6. Final testing and deployment preparation
  - [ ] 6.1 Test complete flow in development
    - Submit valid form and verify email receipt
    - Test validation errors with various invalid inputs
    - Verify error messages are user-friendly
    - Check that form resets on success
    - Verify confetti and toast notifications work
    - _Requirements: All_

  - [ ] 6.2 Update environment variables in Vercel
    - Add `RESEND_API_KEY` to Vercel environment variables
    - Add `RESEND_FROM_EMAIL` to Vercel environment variables
    - Add `RESEND_TO_EMAIL` to Vercel environment variables
    - Configure for production and preview environments
    - _Requirements: 3.1, 3.5_

  - [x] 6.3 Clean up Formspree references
    - Remove Formspree URL from form action attribute
    - Remove any Formspree-specific code or comments
    - Update any documentation mentioning Formspree
    - _Requirements: 1.5_

  - [ ] 6.4 Verify production deployment
    - Deploy to Vercel
    - Test form submission in production
    - Verify emails are received
    - Check Resend dashboard for delivery logs
    - Monitor for any errors in Vercel logs
    - _Requirements: All_

- [ ] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
