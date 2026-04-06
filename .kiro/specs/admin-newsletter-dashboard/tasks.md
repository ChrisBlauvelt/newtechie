

# Implementation Plan: Admin Newsletter Dashboard

## Overview

This implementation plan breaks down the admin newsletter dashboard feature into discrete, incremental tasks. The approach follows a bottom-up strategy: starting with infrastructure setup (Supabase, database), then building core modules (auth, storage, markdown), followed by API routes, and finally the UI components. Each task builds on previous work, ensuring no orphaned code.

## Tasks

- [x] 1. Set up Supabase infrastructure and configuration
  - Create Supabase project and obtain credentials
  - Configure authentication settings (email/password)
  - Create admin user account in Supabase dashboard
  - Set up environment variables for Supabase (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
  - Install Supabase client library: `pnpm add @supabase/supabase-js`
  - Create Supabase client utility file at `src/lib/supabase.ts`
  - _Requirements: 1.1, 1.2, 1.5, 8.7_

- [ ] 2. Create database schema and storage bucket
  - [x] 2.1 Create newsletter_metadata table in Supabase
    - Define table schema with id, filename, storage_path, upload_date, last_modified, file_size, sent_date, recipient_count, created_by
    - Create indexes on upload_date and sent_date
    - _Requirements: 2.3, 3.1, 6.1_
  
  - [x] 2.2 Create newsletter_distributions table
    - Define table schema with id, newsletter_id, sent_at, total_recipients, successful_count, failed_count, failures
    - Create indexes on newsletter_id and sent_at
    - _Requirements: 4.5, 4.6, 4.7_
  
  - [x] 2.3 Create rate_limit_log table
    - Define table schema with id, ip_address, attempt_time, success
    - Create index on ip_address and attempt_time
    - _Requirements: 5.4, 5.5_
  
  - [x] 2.4 Set up Row Level Security (RLS) policies
    - Create policy to restrict newsletter_metadata access to admin user only
    - Create policy to restrict newsletter_distributions access to admin user only
    - Create policy for rate_limit_log (public read for rate limiting check)
    - _Requirements: 1.5, 5.1_
  
  - [x] 2.5 Create Supabase Storage bucket for newsletters
    - Create private bucket named "newsletters"
    - Configure RLS policy for admin-only access
    - _Requirements: 2.3, 3.7_

- [ ] 3. Implement authentication module
  - [x] 3.1 Create authentication service at `src/lib/auth/authService.ts`
    - Implement login function using Supabase Auth
    - Implement logout function
    - Implement session verification function
    - Implement getCurrentUser function
    - Define TypeScript interfaces: AuthResult, User, Session
    - _Requirements: 1.2, 1.3, 1.6_
  
  - [ ]* 3.2 Write property test for invalid credentials rejection
    - **Property 2: Invalid Credentials Rejection**
    - **Validates: Requirements 1.3**
  
  - [ ] 3.3 Create authentication middleware at `src/lib/auth/authGuard.ts`
    - Implement function to verify session token from cookies
    - Implement function to extract user from session
    - Return 401 if session invalid
    - _Requirements: 1.1, 5.3_
  
  - [ ]* 3.4 Write property test for unauthenticated access redirect
    - **Property 1: Unauthenticated Access Redirect**
    - **Validates: Requirements 1.1, 5.3**
  
  - [ ] 3.5 Implement rate limiting service at `src/lib/auth/rateLimiter.ts`
    - Create function to check failed login attempts from IP
    - Create function to record login attempt
    - Implement 5 attempts per hour limit
    - Implement 1 hour block after limit exceeded
    - _Requirements: 5.4, 5.5_
  
  - [ ]* 3.6 Write unit tests for rate limiting
    - Test 5 failed attempts triggers block
    - Test block lasts 1 hour
    - Test successful login resets counter
    - _Requirements: 5.4, 5.5_

- [ ] 4. Implement newsletter storage module
  - [ ] 4.1 Create newsletter repository at `src/lib/newsletter/newsletterRepository.ts`
    - Implement upload function (store file in Supabase Storage, create metadata record)
    - Implement list function with pagination
    - Implement get function by ID
    - Implement update function
    - Implement delete function
    - Implement search function
    - Implement filterByDateRange function
    - Define TypeScript interfaces: Newsletter, NewsletterMetadata, PaginatedNewsletters
    - _Requirements: 2.3, 3.1, 3.5, 3.7, 6.2, 6.4_
  
  - [ ]* 4.2 Write property test for newsletter storage with metadata
    - **Property 4: Newsletter Storage with Metadata**
    - **Validates: Requirements 2.3**
  
  - [ ]* 4.3 Write property test for update preserves upload date
    - **Property 6: Update Preserves Upload Date**
    - **Validates: Requirements 3.5**
  
  - [ ]* 4.4 Write property test for delete removes from storage and list
    - **Property 7: Delete Removes from Storage and List**
    - **Validates: Requirements 3.7**
  
  - [ ] 4.5 Create file validator at `src/lib/newsletter/fileValidator.ts`
    - Implement function to validate file extension (.md only)
    - Implement function to validate file size (max 5MB)
    - Implement function to check for duplicate filenames
    - Return validation errors with clear messages
    - _Requirements: 2.2, 2.4, 2.6, 2.7_
  
  - [ ]* 4.6 Write property test for file upload validation
    - **Property 3: File Upload Validation**
    - **Validates: Requirements 2.2, 2.4, 2.6**
  
  - [ ]* 4.7 Write property test for newsletter list display completeness
    - **Property 5: Newsletter List Display Completeness**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ]* 4.8 Write property test for newsletter list sorting
    - **Property 12: Newsletter List Sorting**
    - **Validates: Requirements 6.1**
  
  - [ ]* 4.9 Write property test for search filtering
    - **Property 13: Search Filtering**
    - **Validates: Requirements 6.2**
  
  - [ ]* 4.10 Write property test for date range filtering
    - **Property 14: Date Range Filtering**
    - **Validates: Requirements 6.4**

- [ ] 5. Checkpoint - Ensure storage and auth tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement markdown processing module
  - [ ] 6.1 Install markdown processing libraries
    - Install marked: `pnpm add marked`
    - Install DOMPurify: `pnpm add isomorphic-dompurify`
    - Install juice for CSS inlining: `pnpm add juice`
    - Install @types packages for TypeScript
    - _Requirements: 7.1, 7.3, 7.5_
  
  - [ ] 6.2 Create markdown renderer at `src/lib/markdown/markdownRenderer.ts`
    - Implement renderForWeb function (markdown → HTML)
    - Implement renderForEmail function (markdown → email HTML)
    - Implement extractPlainText function
    - Implement getPreview function (first 200 chars)
    - _Requirements: 7.1, 7.2, 7.4, 6.5_
  
  - [ ]* 6.3 Write property test for markdown rendering
    - **Property 16: Markdown Rendering**
    - **Validates: Requirements 7.2**
  
  - [ ]* 6.4 Write property test for preview text length
    - **Property 15: Preview Text Length**
    - **Validates: Requirements 6.5**
  
  - [ ] 6.5 Create email formatter at `src/lib/markdown/emailFormatter.ts`
    - Implement inlineStyles function using juice
    - Implement wrapInTemplate function (add email header/footer)
    - _Requirements: 7.3_
  
  - [ ]* 6.6 Write property test for email HTML inline styles
    - **Property 17: Email HTML Inline Styles**
    - **Validates: Requirements 7.3**
  
  - [ ]* 6.7 Write property test for markdown to email HTML conversion
    - **Property 8: Markdown to Email HTML Conversion**
    - **Validates: Requirements 4.3, 7.1**
  
  - [ ] 6.8 Create content sanitizer at `src/lib/markdown/contentSanitizer.ts`
    - Implement sanitize function using DOMPurify
    - Configure to remove script tags, event handlers, iframes
    - Preserve safe formatting (headers, lists, links, bold, italic)
    - _Requirements: 7.5_
  
  - [ ]* 6.9 Write property test for HTML sanitization
    - **Property 18: HTML Sanitization**
    - **Validates: Requirements 7.5**

- [ ] 7. Implement email distribution module
  - [ ] 7.1 Set up Klaviyo integration
    - Add KLAVIYO_API_KEY and KLAVIYO_LIST_ID to environment variables
    - Install Klaviyo SDK or create HTTP client for API
    - _Requirements: 4.2, 8.2_
  
  - [ ] 7.2 Create subscriber service at `src/lib/email/subscriberService.ts`
    - Implement getSubscribers function (fetch from Klaviyo API)
    - Implement getSubscriberCount function
    - Define Subscriber interface
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 7.3 Write unit test for Klaviyo subscriber retrieval
    - Mock Klaviyo API
    - Test successful retrieval
    - Test API error handling
    - _Requirements: 4.2, 8.2_
  
  - [ ] 7.4 Create email service at `src/lib/email/emailService.ts`
    - Implement sendEmail function using existing Resend configuration
    - Implement sendBatch function with rate limiting
    - Define EmailResult and BatchResult interfaces
    - _Requirements: 4.4, 8.1_
  
  - [ ]* 7.5 Write unit test for Resend email sending
    - Mock Resend API
    - Test successful send
    - Test API error handling
    - _Requirements: 4.4_
  
  - [ ] 7.6 Create distribution manager at `src/lib/email/distributionManager.ts`
    - Implement distribute function (orchestrate full send process)
    - Implement wasRecentlySent function (check 24-hour window)
    - Implement recordDistribution function (save to database)
    - Define DistributionResult interface
    - _Requirements: 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 7.7 Write property test for newsletter distribution to all subscribers
    - **Property 9: Newsletter Distribution to All Subscribers**
    - **Validates: Requirements 4.4**
  
  - [ ]* 7.8 Write property test for duplicate send prevention
    - **Property 10: Duplicate Send Prevention**
    - **Validates: Requirements 4.6**

- [ ] 8. Checkpoint - Ensure email distribution tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement logging service
  - [ ] 9.1 Create action logger at `src/lib/logging/actionLogger.ts`
    - Implement logAction function (record to database or file)
    - Log action type, timestamp, user ID, details
    - Define ActionLog interface
    - _Requirements: 5.6_
  
  - [ ]* 9.2 Write property test for action logging
    - **Property 11: Action Logging**
    - **Validates: Requirements 5.6**

- [ ] 10. Create API routes for authentication
  - [ ] 10.1 Create login API route at `src/routes/api/auth/login/+server.ts`
    - Handle POST request with email and password
    - Call authService.login
    - Check rate limiting before authentication
    - Set HTTP-only cookie with session token
    - Return success or error response
    - _Requirements: 1.2, 1.3, 5.4_
  
  - [ ]* 10.2 Write unit test for login API route
    - Test successful login
    - Test invalid credentials
    - Test rate limiting
    - _Requirements: 1.2, 1.3, 5.4_
  
  - [ ] 10.3 Create logout API route at `src/routes/api/auth/logout/+server.ts`
    - Handle POST request
    - Call authService.logout
    - Clear session cookie
    - Return success response
    - _Requirements: 1.6_
  
  - [ ] 10.4 Create session check API route at `src/routes/api/auth/session/+server.ts`
    - Handle GET request
    - Verify session token from cookie
    - Return authenticated status and user info
    - _Requirements: 1.4, 5.2_

- [ ] 11. Create API routes for newsletter management
  - [ ] 11.1 Create newsletter upload API route at `src/routes/api/newsletters/+server.ts` (POST)
    - Apply authGuard middleware
    - Parse multipart form data
    - Validate file using fileValidator
    - Call newsletterRepository.upload
    - Log action
    - Return success or error response
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 11.2 Write unit test for newsletter upload API
    - Test successful upload
    - Test invalid file type rejection
    - Test file size limit
    - Test duplicate filename handling
    - _Requirements: 2.2, 2.4, 2.6, 2.7_
  
  - [ ] 11.3 Create newsletter list API route at `src/routes/api/newsletters/+server.ts` (GET)
    - Apply authGuard middleware
    - Parse query parameters (page, pageSize, search, startDate, endDate)
    - Call newsletterRepository.list or search or filterByDateRange
    - Return paginated results
    - _Requirements: 3.1, 3.2, 6.2, 6.3, 6.4_
  
  - [ ] 11.4 Create newsletter get API route at `src/routes/api/newsletters/[id]/+server.ts` (GET)
    - Apply authGuard middleware
    - Call newsletterRepository.get
    - Return newsletter data or 404
    - _Requirements: 3.3_
  
  - [ ] 11.5 Create newsletter update API route at `src/routes/api/newsletters/[id]/+server.ts` (PUT)
    - Apply authGuard middleware
    - Parse request body (content)
    - Call newsletterRepository.update
    - Log action
    - Return updated newsletter or error
    - _Requirements: 3.4, 3.5_
  
  - [ ] 11.6 Create newsletter delete API route at `src/routes/api/newsletters/[id]/+server.ts` (DELETE)
    - Apply authGuard middleware
    - Call newsletterRepository.delete
    - Log action
    - Return success or error
    - _Requirements: 3.6, 3.7_
  
  - [ ]* 11.7 Write integration tests for newsletter CRUD operations
    - Test full upload → list → get → update → delete flow
    - _Requirements: 2.3, 3.1, 3.5, 3.7_

- [ ] 12. Create API routes for email distribution
  - [ ] 12.1 Create subscriber count API route at `src/routes/api/subscribers/count/+server.ts`
    - Apply authGuard middleware
    - Call subscriberService.getSubscriberCount
    - Return count or error
    - _Requirements: 4.1_
  
  - [ ] 12.2 Create newsletter send API route at `src/routes/api/newsletters/[id]/send/+server.ts`
    - Apply authGuard middleware
    - Check if newsletter was recently sent (wasRecentlySent)
    - Get newsletter content
    - Render markdown to email HTML
    - Get subscribers from Klaviyo
    - Call distributionManager.distribute
    - Log action
    - Return distribution result
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 12.3 Write integration test for newsletter send flow
    - Mock Klaviyo and Resend APIs
    - Test successful distribution
    - Test duplicate send prevention
    - Test error handling
    - _Requirements: 4.4, 4.6, 4.7_

- [ ] 13. Checkpoint - Ensure all API routes work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Create admin dashboard UI layout and navigation
  - [ ] 14.1 Create admin layout component at `src/routes/admin/+layout.svelte`
    - Add navigation header with logo and logout button
    - Add sidebar with links to dashboard, upload
    - Apply Tailwind CSS styling consistent with main site
    - Use glassmorphic effects
    - Make responsive (mobile-first)
    - _Requirements: 8.4_
  
  - [ ] 14.2 Create admin route guard at `src/routes/admin/+layout.server.ts`
    - Check session on server side
    - Redirect to login if not authenticated
    - Load user data for layout
    - _Requirements: 1.1_

- [ ] 15. Create login page
  - [ ] 15.1 Create login page at `src/routes/admin/login/+page.svelte`
    - Create LoginForm component with email and password fields
    - Handle form submission (POST to /api/auth/login)
    - Display error messages for invalid credentials
    - Display rate limit message if blocked
    - Redirect to dashboard on successful login
    - Apply Tailwind CSS styling
    - _Requirements: 1.1, 1.2, 1.3, 5.4_
  
  - [ ]* 15.2 Write unit test for login form component
    - Test form validation
    - Test successful login flow
    - Test error display
    - _Requirements: 1.2, 1.3_

- [ ] 16. Create newsletter list/dashboard page
  - [ ] 16.1 Create dashboard page at `src/routes/admin/dashboard/+page.svelte`
    - Create NewsletterList component
    - Fetch newsletters from API on mount
    - Display table with filename, upload date, file size, actions
    - Implement pagination (10 items per page)
    - Add search input (filter by filename/content)
    - Add date range filter inputs
    - Add "Upload New" button linking to upload page
    - Add action buttons for each newsletter (view, edit, delete, send)
    - Apply Tailwind CSS styling
    - _Requirements: 3.1, 3.2, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 16.2 Implement newsletter preview in list
    - Display first 200 characters of content
    - Truncate with ellipsis if longer
    - _Requirements: 6.5_
  
  - [ ]* 16.3 Write unit test for newsletter list component
    - Test rendering with mock data
    - Test pagination
    - Test search filtering
    - Test date range filtering
    - _Requirements: 3.1, 6.2, 6.4_

- [ ] 17. Create newsletter upload page
  - [ ] 17.1 Create upload page at `src/routes/admin/newsletters/upload/+page.svelte`
    - Create NewsletterUpload component with file input
    - Validate file client-side (.md extension, max 5MB)
    - Handle file upload (POST to /api/newsletters)
    - Display upload progress
    - Show success message and redirect to dashboard
    - Show error message if upload fails
    - Apply Tailwind CSS styling
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_
  
  - [ ] 17.2 Handle duplicate filename confirmation
    - Display modal if duplicate filename detected
    - Allow user to confirm overwrite or cancel
    - _Requirements: 2.7_
  
  - [ ]* 17.3 Write unit test for upload component
    - Test file validation
    - Test successful upload
    - Test error handling
    - _Requirements: 2.2, 2.4, 2.6_

- [ ] 18. Create newsletter view/edit page
  - [ ] 18.1 Create newsletter detail page at `src/routes/admin/newsletters/[id]/+page.svelte`
    - Fetch newsletter data from API
    - Create NewsletterEditor component with markdown textarea
    - Create NewsletterPreview component showing rendered HTML
    - Display both raw markdown and rendered preview side-by-side
    - Add "Save" button (PUT to /api/newsletters/[id])
    - Add "Delete" button with confirmation modal
    - Add "Send Newsletter" button linking to send page
    - Apply Tailwind CSS styling
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 7.4_
  
  - [ ] 18.2 Implement markdown preview rendering
    - Use markdownRenderer.renderForWeb
    - Update preview in real-time as user types
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [ ]* 18.3 Write unit test for editor component
    - Test markdown rendering
    - Test save functionality
    - Test delete confirmation
    - _Requirements: 3.4, 3.5, 3.6_

- [ ] 19. Create newsletter send page
  - [ ] 19.1 Create send page at `src/routes/admin/newsletters/[id]/send/+page.svelte`
    - Fetch newsletter data
    - Fetch subscriber count from API
    - Create DistributionPanel component
    - Display newsletter preview (email HTML version)
    - Display subscriber count
    - Add "Send to All Subscribers" button with confirmation modal
    - Handle send request (POST to /api/newsletters/[id]/send)
    - Display distribution result (total sent, successful, failed)
    - Show list of failed emails if any
    - Apply Tailwind CSS styling
    - _Requirements: 4.1, 4.2, 4.5, 4.7_
  
  - [ ] 19.2 Implement send confirmation modal
    - Display subscriber count in modal
    - Warn about duplicate send if recently sent
    - Require explicit confirmation
    - _Requirements: 4.6_
  
  - [ ]* 19.3 Write unit test for distribution panel component
    - Test subscriber count display
    - Test send confirmation
    - Test result display
    - _Requirements: 4.1, 4.5_

- [ ] 20. Add toast notifications for user feedback
  - [ ] 20.1 Create toast notification component at `src/lib/components/Toast.svelte`
    - Support success, error, info types
    - Auto-dismiss after 3 seconds
    - Apply Tailwind CSS styling
    - _Requirements: 2.5_
  
  - [ ] 20.2 Integrate toast notifications throughout admin UI
    - Show success toast on upload, edit, delete, send
    - Show error toast on failures
    - _Requirements: 2.5, 3.5, 3.7, 4.5_

- [ ] 21. Final checkpoint - End-to-end testing
  - [ ] 21.1 Test complete authentication flow
    - Login with valid credentials
    - Access protected routes
    - Logout and verify redirect
    - _Requirements: 1.1, 1.2, 1.6_
  
  - [ ] 21.2 Test complete newsletter management flow
    - Upload newsletter
    - View in list
    - Edit content
    - Delete newsletter
    - _Requirements: 2.3, 3.1, 3.5, 3.7_
  
  - [ ] 21.3 Test complete newsletter distribution flow
    - Upload newsletter
    - Preview email rendering
    - Check subscriber count
    - Send to subscribers
    - Verify duplicate send prevention
    - _Requirements: 4.1, 4.2, 4.4, 4.6_
  
  - [ ] 21.4 Test error handling and edge cases
    - Invalid file uploads
    - Network errors
    - API failures
    - Rate limiting
    - _Requirements: 2.4, 2.6, 5.4_
  
  - [ ] 21.5 Test responsive design on mobile devices
    - Verify all pages work on mobile
    - Test touch interactions
    - _Requirements: 8.4_

- [ ] 22. Documentation and deployment preparation
  - [ ] 22.1 Create setup documentation
    - Document Supabase setup steps
    - Document environment variables
    - Document admin user creation
    - Document Klaviyo integration setup
    - _Requirements: 8.1, 8.2, 8.6, 8.7_
  
  - [ ] 22.2 Update .env.local.example with new variables
    - Add Supabase variables
    - Add Klaviyo variables
    - Add admin email variable
    - _Requirements: 8.6_
  
  - [ ] 22.3 Configure Vercel environment variables
    - Add all required environment variables in Vercel dashboard
    - Verify deployment configuration
    - _Requirements: 8.5, 8.7_
  
  - [ ] 22.4 Deploy to Vercel and verify production functionality
    - Deploy to production
    - Test login in production
    - Test newsletter upload in production
    - Test email sending in production
    - _Requirements: 8.5_

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across many generated inputs
- Unit tests validate specific examples, edge cases, and integration points
- The implementation follows existing project conventions (SvelteKit routing, Tailwind CSS, Vercel deployment)
- All sensitive configuration (API keys, service role keys) must be stored in environment variables
- The admin dashboard is completely separate from the public site, accessible only at /admin routes
