# Design Document: Admin Newsletter Dashboard

## Overview

The Admin Newsletter Dashboard is a secure, single-admin web application built with SvelteKit that enables the site owner to manage monthly newsletter content. The system integrates Supabase for authentication, provides markdown file upload and management capabilities, and connects with existing Klaviyo subscriber lists and Resend email service for newsletter distribution.

### Key Design Principles

- **Security First**: Single admin authentication with session management and rate limiting
- **Simple Integration**: Leverage existing infrastructure (Resend, Klaviyo, SvelteKit, Tailwind)
- **User-Friendly**: Intuitive interface for non-technical content management
- **Maintainable**: Follow existing project conventions and patterns

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Admin Dashboard UI (SvelteKit)               │  │
│  │  - Login Page                                        │  │
│  │  - Newsletter List View                              │  │
│  │  - Upload Interface                                  │  │
│  │  - Editor/Preview                                    │  │
│  │  - Distribution Interface                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SvelteKit Server (Vercel)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (+server.ts)                 │  │
│  │  - /api/auth/login                                   │  │
│  │  - /api/auth/logout                                  │  │
│  │  - /api/newsletters (CRUD)                           │  │
│  │  - /api/newsletters/send                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
         ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Supabase   │ │   Supabase   │ │   Klaviyo    │ │    Resend    │
│     Auth     │ │   Storage    │ │     API      │ │     API      │
│              │ │              │ │              │ │              │
│ - Admin      │ │ - Newsletter │ │ - Subscriber │ │ - Email      │
│   Login      │ │   Files      │ │   List       │ │   Delivery   │
│ - Session    │ │ - Metadata   │ │              │ │              │
│   Mgmt       │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Technology Stack

- **Frontend**: SvelteKit 2.4.0, Svelte 4.2.7, Tailwind CSS 3.3.5
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for markdown files and metadata)
- **Email Service**: Resend API (existing integration)
- **Subscriber Management**: Klaviyo API (existing integration)
- **Markdown Processing**: marked.js (for rendering) + DOMPurify (for sanitization)
- **Deployment**: Vercel with Node.js 20.x runtime

## Components and Interfaces

### 1. Authentication Module

**Purpose**: Manage admin authentication and session state using Supabase Auth.

**Components**:

- `AuthService`: Handles Supabase authentication operations
- `AuthGuard`: Middleware to protect admin routes
- `SessionManager`: Manages authentication tokens and expiration

**Key Functions**:

```typescript
interface AuthService {
  // Authenticate admin user with email and password
  login(email: string, password: string): Promise<AuthResult>
  
  // End admin session
  logout(): Promise<void>
  
  // Verify current session is valid
  verifySession(token: string): Promise<boolean>
  
  // Get current authenticated user
  getCurrentUser(): Promise<User | null>
}

interface AuthResult {
  success: boolean
  user?: User
  session?: Session
  error?: string
}

interface User {
  id: string
  email: string
  role: 'admin'
}

interface Session {
  access_token: string
  refresh_token: string
  expires_at: number
}
```

**Implementation Notes**:
- Use Supabase's built-in email/password authentication
- Configure Supabase to allow only a single admin user (via Row Level Security policies)
- Store session tokens in HTTP-only cookies for security
- Implement automatic token refresh before expiration

### 2. Newsletter Storage Module

**Purpose**: Manage newsletter file storage, retrieval, and metadata using Supabase Storage.

**Components**:

- `NewsletterRepository`: CRUD operations for newsletter files
- `FileValidator`: Validates uploaded files
- `MetadataManager`: Manages newsletter metadata

**Key Functions**:

```typescript
interface NewsletterRepository {
  // Upload a new newsletter file
  upload(file: File, metadata: NewsletterMetadata): Promise<Newsletter>
  
  // Retrieve all newsletters with pagination
  list(page: number, pageSize: number): Promise<PaginatedNewsletters>
  
  // Get a specific newsletter by ID
  get(id: string): Promise<Newsletter>
  
  // Update newsletter content
  update(id: string, content: string): Promise<Newsletter>
  
  // Delete a newsletter
  delete(id: string): Promise<void>
  
  // Search newsletters by filename or content
  search(query: string): Promise<Newsletter[]>
  
  // Filter newsletters by date range
  filterByDateRange(startDate: Date, endDate: Date): Promise<Newsletter[]>
}

interface Newsletter {
  id: string
  filename: string
  content: string  // Raw markdown
  uploadDate: Date
  lastModified: Date
  fileSize: number
  sentDate?: Date
  recipientCount?: number
}

interface NewsletterMetadata {
  filename: string
  uploadDate: Date
  fileSize: number
}

interface PaginatedNewsletters {
  newsletters: Newsletter[]
  totalCount: number
  currentPage: number
  totalPages: number
}
```

**Storage Structure**:
- Supabase Storage bucket: `newsletters`
- File naming: `{timestamp}_{original_filename}.md`
- Metadata stored in Supabase database table: `newsletter_metadata`

**Database Schema**:

```sql
CREATE TABLE newsletter_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_size INTEGER NOT NULL,
  sent_date TIMESTAMPTZ,
  recipient_count INTEGER,
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_newsletter_upload_date ON newsletter_metadata(upload_date DESC);
CREATE INDEX idx_newsletter_sent_date ON newsletter_metadata(sent_date DESC);
```

### 3. Markdown Processing Module

**Purpose**: Render and sanitize markdown content for preview and email distribution.

**Components**:

- `MarkdownRenderer`: Converts markdown to HTML
- `EmailFormatter`: Converts markdown to email-compatible HTML with inline styles
- `ContentSanitizer`: Removes potentially dangerous HTML

**Key Functions**:

```typescript
interface MarkdownRenderer {
  // Render markdown to HTML for web preview
  renderForWeb(markdown: string): string
  
  // Render markdown to email-compatible HTML
  renderForEmail(markdown: string): string
  
  // Extract plain text from markdown (for email subject/preview)
  extractPlainText(markdown: string): string
  
  // Get preview text (first N characters)
  getPreview(markdown: string, maxLength: number): string
}

interface EmailFormatter {
  // Convert HTML to inline-styled HTML for email clients
  inlineStyles(html: string): string
  
  // Wrap content in email template
  wrapInTemplate(content: string, subject: string): string
}

interface ContentSanitizer {
  // Remove dangerous HTML tags and attributes
  sanitize(html: string): string
}
```

**Implementation Notes**:
- Use `marked` library for markdown parsing
- Use `DOMPurify` for HTML sanitization
- Use `juice` or similar for CSS inlining
- Support standard markdown: headers, lists, links, bold, italic, code blocks, images

### 4. Email Distribution Module

**Purpose**: Send newsletters to subscribers via Resend, retrieving subscriber list from Klaviyo.

**Components**:

- `EmailService`: Sends emails via Resend
- `SubscriberService`: Retrieves subscribers from Klaviyo
- `DistributionManager`: Orchestrates newsletter sending

**Key Functions**:

```typescript
interface EmailService {
  // Send email to a single recipient
  sendEmail(to: string, subject: string, html: string): Promise<EmailResult>
  
  // Send email to multiple recipients (batch)
  sendBatch(recipients: string[], subject: string, html: string): Promise<BatchResult>
}

interface SubscriberService {
  // Get all newsletter subscribers from Klaviyo
  getSubscribers(): Promise<Subscriber[]>
  
  // Get subscriber count
  getSubscriberCount(): Promise<number>
}

interface DistributionManager {
  // Send newsletter to all subscribers
  distribute(newsletterId: string): Promise<DistributionResult>
  
  // Check if newsletter was recently sent (prevent duplicates)
  wasRecentlySent(newsletterId: string): Promise<boolean>
  
  // Record distribution attempt
  recordDistribution(newsletterId: string, result: DistributionResult): Promise<void>
}

interface Subscriber {
  email: string
  firstName?: string
  lastName?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

interface BatchResult {
  totalSent: number
  successful: number
  failed: number
  failures: Array<{
    email: string
    error: string
  }>
}

interface DistributionResult {
  newsletterId: string
  totalRecipients: number
  successful: number
  failed: number
  failures: Array<{
    email: string
    error: string
  }>
  sentAt: Date
}
```

**Implementation Notes**:
- Use existing Resend configuration from environment variables
- Integrate with Klaviyo API to fetch subscriber list
- Implement batch sending with rate limiting (Resend limits)
- Store distribution history in database for duplicate prevention
- Generate email subject from newsletter filename or first heading

**Database Schema for Distribution Tracking**:

```sql
CREATE TABLE newsletter_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id UUID REFERENCES newsletter_metadata(id),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_recipients INTEGER NOT NULL,
  successful_count INTEGER NOT NULL,
  failed_count INTEGER NOT NULL,
  failures JSONB
);

CREATE INDEX idx_distribution_newsletter ON newsletter_distributions(newsletter_id);
CREATE INDEX idx_distribution_sent_at ON newsletter_distributions(sent_at DESC);
```

### 5. Admin Dashboard UI

**Purpose**: Provide intuitive interface for all admin operations.

**Routes**:

- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard (newsletter list)
- `/admin/newsletters/upload` - Upload new newsletter
- `/admin/newsletters/[id]` - View/edit specific newsletter
- `/admin/newsletters/[id]/preview` - Preview newsletter rendering
- `/admin/newsletters/[id]/send` - Send newsletter interface

**Components**:

- `LoginForm.svelte` - Authentication form
- `NewsletterList.svelte` - Paginated list of newsletters
- `NewsletterUpload.svelte` - File upload interface
- `NewsletterEditor.svelte` - Markdown editor with preview
- `NewsletterPreview.svelte` - Rendered markdown display
- `DistributionPanel.svelte` - Send newsletter interface
- `AdminLayout.svelte` - Common layout with navigation and logout

**UI Design Patterns**:
- Follow existing Tailwind CSS styling conventions
- Use glassmorphic effects consistent with main site
- Responsive design (mobile-first)
- Loading states for async operations
- Toast notifications for success/error messages
- Confirmation modals for destructive actions (delete, send)

### 6. API Routes

**Purpose**: Server-side endpoints for all operations.

**Authentication Endpoints**:

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

// POST /api/auth/logout
interface LogoutResponse {
  success: boolean
}

// GET /api/auth/session
interface SessionResponse {
  authenticated: boolean
  user?: User
}
```

**Newsletter Endpoints**:

```typescript
// POST /api/newsletters (upload)
// Multipart form data with file
interface UploadResponse {
  success: boolean
  newsletter?: Newsletter
  error?: string
}

// GET /api/newsletters (list)
interface ListRequest {
  page?: number
  pageSize?: number
  search?: string
  startDate?: string
  endDate?: string
}

interface ListResponse {
  success: boolean
  data?: PaginatedNewsletters
  error?: string
}

// GET /api/newsletters/[id]
interface GetResponse {
  success: boolean
  newsletter?: Newsletter
  error?: string
}

// PUT /api/newsletters/[id]
interface UpdateRequest {
  content: string
}

interface UpdateResponse {
  success: boolean
  newsletter?: Newsletter
  error?: string
}

// DELETE /api/newsletters/[id]
interface DeleteResponse {
  success: boolean
  error?: string
}

// POST /api/newsletters/[id]/send
interface SendRequest {
  newsletterId: string
}

interface SendResponse {
  success: boolean
  result?: DistributionResult
  error?: string
}

// GET /api/subscribers/count
interface SubscriberCountResponse {
  success: boolean
  count?: number
  error?: string
}
```

**Security Middleware**:
- All `/api/newsletters/*` and `/api/auth/logout` endpoints require valid session
- Rate limiting on `/api/auth/login`: 5 attempts per hour per IP
- CSRF protection on state-changing operations
- Input validation on all endpoints

## Data Models

### Supabase Configuration

**Authentication**:
- Single admin user created manually in Supabase dashboard
- Email/password authentication enabled
- Row Level Security (RLS) policies to restrict access

**Storage**:
- Bucket: `newsletters` (private, admin-only access)
- RLS policies: Only authenticated admin can read/write

**Database Tables**:

1. `newsletter_metadata` - Stores newsletter file metadata
2. `newsletter_distributions` - Tracks newsletter send history
3. `rate_limit_log` - Tracks login attempts for rate limiting

**RLS Policies**:

```sql
-- Only admin can access newsletter_metadata
CREATE POLICY "Admin only access" ON newsletter_metadata
  FOR ALL
  USING (auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'));

-- Only admin can access newsletter_distributions
CREATE POLICY "Admin only access" ON newsletter_distributions
  FOR ALL
  USING (auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'));
```

### Environment Variables

**Development (.env.local)**:
```env
# Existing
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@mail.techieneighbor.net
RESEND_TO_EMAIL=contact@techieneighbor.net

# New for newsletter dashboard
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
KLAVIYO_API_KEY=pk_xxxxx
KLAVIYO_LIST_ID=xxxxx
ADMIN_EMAIL=admin@techieneighbor.net
```

**Production (Vercel Environment Variables)**:
- Same variables configured in Vercel dashboard
- Service role key kept secure (not exposed to client)

### File Upload Flow

1. Admin selects .md file in upload form
2. Client validates file extension and size (<5MB)
3. File sent to `/api/newsletters` via multipart form data
4. Server validates file again
5. Generate unique storage path: `{timestamp}_{filename}.md`
6. Upload file to Supabase Storage bucket
7. Create metadata record in database
8. Return newsletter object to client
9. Client displays success message and redirects to newsletter list

### Newsletter Send Flow

1. Admin clicks "Send" on a newsletter
2. Client requests subscriber count from `/api/subscribers/count`
3. Display confirmation modal with subscriber count
4. Admin confirms send
5. Client sends POST to `/api/newsletters/[id]/send`
6. Server checks if newsletter was sent in last 24 hours
7. If not, retrieve subscriber list from Klaviyo
8. Render markdown to email HTML
9. Send emails in batches via Resend (respect rate limits)
10. Record distribution in database
11. Return distribution result to client
12. Client displays success/failure summary


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Unauthenticated Access Redirect

*For any* unauthenticated request to an admin route, the system should redirect to the login page and deny access to protected resources.

**Validates: Requirements 1.1, 5.3**

### Property 2: Invalid Credentials Rejection

*For any* invalid credential combination (wrong email, wrong password, or non-existent user), the authentication system should reject the login attempt and return an appropriate error message.

**Validates: Requirements 1.3**

### Property 3: File Upload Validation

*For any* file upload attempt, the system should accept the file if and only if it has a .md extension and is 5MB or smaller, rejecting all other files with appropriate error messages.

**Validates: Requirements 2.2, 2.4, 2.6**

### Property 4: Newsletter Storage with Metadata

*For any* valid markdown file upload, the system should store the file in Supabase Storage and create a metadata record containing the filename, upload date, and file size.

**Validates: Requirements 2.3**

### Property 5: Newsletter List Display Completeness

*For any* set of uploaded newsletters, the dashboard list view should display all newsletters with their filename, upload date, and file size visible for each entry.

**Validates: Requirements 3.1, 3.2**

### Property 6: Update Preserves Upload Date

*For any* newsletter edit operation, saving the updated content should modify the file content and last_modified timestamp but preserve the original upload_date unchanged.

**Validates: Requirements 3.5**

### Property 7: Delete Removes from Storage and List

*For any* newsletter deletion, the system should remove the file from Supabase Storage, delete the metadata record, and remove it from the displayed list.

**Validates: Requirements 3.7**

### Property 8: Markdown to Email HTML Conversion

*For any* valid markdown content, the email rendering system should convert it to valid HTML with inline styles suitable for email clients.

**Validates: Requirements 4.3, 7.1**

### Property 9: Newsletter Distribution to All Subscribers

*For any* newsletter distribution request, the system should send the email to every subscriber in the Klaviyo subscriber list.

**Validates: Requirements 4.4**

### Property 10: Duplicate Send Prevention

*For any* newsletter that has been sent within the last 24 hours, attempting to send it again should be blocked and return an error indicating the newsletter was recently sent.

**Validates: Requirements 4.6**

### Property 11: Action Logging

*For any* admin action (upload, edit, delete, send), the system should create a log entry recording the action type, timestamp, and admin user ID.

**Validates: Requirements 5.6**

### Property 12: Newsletter List Sorting

*For any* set of newsletters displayed in the list view, they should be sorted by upload date in descending order (newest first).

**Validates: Requirements 6.1**

### Property 13: Search Filtering

*For any* search query, the system should return only newsletters whose filename or content contains the search keywords.

**Validates: Requirements 6.2**

### Property 14: Date Range Filtering

*For any* date range filter (start date and end date), the system should return only newsletters with upload dates within that range (inclusive).

**Validates: Requirements 6.4**

### Property 15: Preview Text Length

*For any* newsletter in the list view, the preview text should be at most 200 characters, truncated from the beginning of the newsletter content.

**Validates: Requirements 6.5**

### Property 16: Markdown Rendering

*For any* valid markdown content, the rendering system should convert it to valid HTML that properly displays headers, lists, links, bold, italic, and code blocks.

**Validates: Requirements 7.2**

### Property 17: Email HTML Inline Styles

*For any* markdown content rendered for email, the resulting HTML should have all CSS styles inlined (no external stylesheets or style tags).

**Validates: Requirements 7.3**

### Property 18: HTML Sanitization

*For any* markdown content that includes potentially dangerous HTML (script tags, event handlers, iframes), the sanitization process should remove or neutralize these elements while preserving safe formatting.

**Validates: Requirements 7.5**

## Error Handling

### Authentication Errors

- **Invalid Credentials**: Return 401 with clear error message
- **Session Expired**: Return 401 and redirect to login
- **Rate Limit Exceeded**: Return 429 with retry-after header
- **Missing Token**: Return 401 and redirect to login

### File Upload Errors

- **Invalid File Type**: Return 400 with "Only .md files are allowed"
- **File Too Large**: Return 413 with "File must be 5MB or smaller"
- **Storage Failure**: Return 500 with "Failed to upload file, please try again"
- **Duplicate Filename**: Return 409 with confirmation prompt

### Newsletter Management Errors

- **Newsletter Not Found**: Return 404 with "Newsletter not found"
- **Update Failure**: Return 500 with "Failed to update newsletter"
- **Delete Failure**: Return 500 with "Failed to delete newsletter"
- **Permission Denied**: Return 403 with "Unauthorized access"

### Email Distribution Errors

- **Klaviyo API Failure**: Return 502 with "Failed to retrieve subscribers"
- **Resend API Failure**: Return 502 with "Failed to send emails"
- **Duplicate Send Attempt**: Return 409 with "Newsletter was sent within last 24 hours"
- **No Subscribers**: Return 400 with "No subscribers found"

### Error Logging

All errors should be logged with:
- Timestamp
- Error type and message
- User ID (if authenticated)
- Request details (route, method)
- Stack trace (for 500 errors)

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific examples and edge cases with property-based tests for universal correctness properties. Both approaches are complementary and necessary for comprehensive coverage.

**Unit Tests** focus on:
- Specific authentication flows (valid login, invalid login, logout)
- Edge cases (empty files, maximum file size, special characters in filenames)
- Integration points (Supabase Auth, Klaviyo API, Resend API)
- Error conditions (network failures, API errors, invalid data)
- UI component rendering and interactions

**Property-Based Tests** focus on:
- Universal properties across all inputs (file validation, markdown rendering)
- Comprehensive input coverage through randomization
- Invariants that must hold (upload date preservation, list completeness)
- Round-trip properties (markdown → HTML → display)

### Property-Based Testing Configuration

**Library**: fast-check (already in dependencies)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: admin-newsletter-dashboard, Property {number}: {property_text}`
- Custom generators for:
  - Valid markdown content
  - Newsletter metadata
  - Email addresses
  - File objects with various extensions and sizes

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Feature: admin-newsletter-dashboard, Property 3: File Upload Validation', () => {
  it('should accept only .md files under 5MB', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          extension: fc.constantFrom('.md', '.txt', '.pdf', '.doc'),
          size: fc.integer({ min: 0, max: 10 * 1024 * 1024 })
        }),
        (file) => {
          const isValid = file.extension === '.md' && file.size <= 5 * 1024 * 1024;
          const result = validateFile(file);
          expect(result.valid).toBe(isValid);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

**Authentication Module**:
- Login with valid credentials
- Login with invalid credentials
- Session expiration handling
- Logout functionality
- Rate limiting (5 attempts per hour)

**File Upload Module**:
- Upload valid .md file
- Reject non-.md file
- Reject file over 5MB
- Handle duplicate filenames
- Storage integration

**Newsletter Management Module**:
- List all newsletters
- View newsletter content
- Edit newsletter content
- Delete newsletter
- Search and filter

**Email Distribution Module**:
- Retrieve Klaviyo subscribers
- Convert markdown to email HTML
- Send to all subscribers
- Handle send failures
- Prevent duplicate sends

**Markdown Rendering Module**:
- Render standard markdown features
- Sanitize dangerous HTML
- Generate email-compatible HTML
- Create preview text

### Integration Tests

- End-to-end authentication flow
- Complete newsletter upload and send workflow
- Supabase Storage integration
- Klaviyo API integration
- Resend API integration

### Manual Testing Checklist

- [ ] Admin can log in with correct credentials
- [ ] Invalid credentials are rejected
- [ ] Session expires after 24 hours
- [ ] Rate limiting blocks after 5 failed attempts
- [ ] File upload accepts .md files
- [ ] File upload rejects non-.md files
- [ ] Newsletter list displays all uploaded files
- [ ] Newsletter content renders correctly
- [ ] Edit preserves upload date
- [ ] Delete removes file from storage
- [ ] Search filters newsletters correctly
- [ ] Date range filter works correctly
- [ ] Newsletter sends to all Klaviyo subscribers
- [ ] Duplicate send is prevented within 24 hours
- [ ] Email HTML renders correctly in email clients
- [ ] UI is responsive on mobile devices
- [ ] All admin actions are logged

### Performance Considerations

- Newsletter list pagination (10 items per page) prevents loading large datasets
- Batch email sending with rate limiting respects Resend API limits
- Markdown rendering cached for preview performance
- File uploads limited to 5MB to prevent storage issues
- Database indexes on upload_date and sent_date for fast queries

### Security Testing

- [ ] HTTPS enforced on all admin routes
- [ ] Authentication required for all admin actions
- [ ] Session tokens expire after 24 hours
- [ ] Rate limiting prevents brute force attacks
- [ ] HTML sanitization prevents XSS attacks
- [ ] File upload validation prevents malicious files
- [ ] RLS policies restrict database access to admin only
- [ ] Environment variables not exposed to client
