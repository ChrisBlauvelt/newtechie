# Design Document: Resend Email Migration

## Overview

This design outlines the migration from Formspree to Resend for handling contact form submissions. The solution involves creating a SvelteKit server endpoint (`+server.js`) that receives form data, validates it, and uses the Resend API to send formatted emails. The client-side form will be updated to submit to this endpoint instead of directly to Formspree.

The migration provides several benefits:
- Full control over email formatting and content
- Server-side validation and security
- Better error handling and logging
- No dependency on third-party form services
- Ability to customize and extend functionality

## Architecture

### High-Level Flow

```
User fills form → Client submits to /api/contact → Server validates → Resend API → Email delivered
                                                         ↓
                                                   Response to client
                                                         ↓
                                              Success/Error message shown
```

### Components

1. **Client-Side Form** (`src/routes/+page.svelte`)
   - Collects user input (name, email, message)
   - Submits data to server endpoint
   - Displays success/error feedback
   - Maintains existing UI/UX

2. **Server Endpoint** (`src/routes/api/contact/+server.js`)
   - Receives POST requests with form data
   - Validates input data
   - Calls Resend API
   - Returns JSON responses

3. **Resend API Integration**
   - Official Resend Node.js SDK
   - Handles email delivery
   - Provides delivery status

4. **Environment Configuration**
   - Stores API key securely
   - Configures sender/recipient emails

## Components and Interfaces

### 1. Server Endpoint API

**Endpoint:** `POST /api/contact`

**Request Body:**
```typescript
{
  name: string;      // User's name (required, max 200 chars)
  email: string;     // User's email (required, valid email format, max 200 chars)
  message: string;   // User's message (required, non-empty after trim)
}
```

**Success Response (200):**
```typescript
{
  success: true;
  message: "Message sent successfully"
}
```

**Error Response (400/500):**
```typescript
{
  success: false;
  error: string;  // User-friendly error message
}
```

### 2. Resend SDK Interface

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: string,      // Verified sender email
  to: string,        // Recipient email
  replyTo: string,   // User's email for replies
  subject: string,   // Email subject
  html: string       // HTML email body
});
```

### 3. Client-Side Form Handler

```javascript
async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    })
  });
  
  const result = await response.json();
  // Handle success/error
}
```

## Data Models

### Form Submission Data

```typescript
interface ContactFormData {
  name: string;        // 1-200 characters, trimmed
  email: string;       // Valid email format, 1-200 characters
  message: string;     // Non-empty after trim, no max length
}
```

### Email Template Data

```typescript
interface EmailData {
  from: string;        // "TechieNeighbor <noreply@techieneighbor.net>"
  to: string;          // Business owner's email
  replyTo: string;     // User's submitted email
  subject: string;     // "Contact Form Submission from {name}"
  html: string;        // Formatted HTML email body
}
```

### Validation Rules

- **name**: Required, 1-200 characters after trim, non-empty
- **email**: Required, valid email regex, 1-200 characters
- **message**: Required, non-empty after trim
- All fields must be strings

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After reviewing the acceptance criteria, several properties can be combined or are redundant. For example, properties about email content (subject, from, reply-to, HTML format) can be consolidated into a single comprehensive property that validates the complete email structure. Similarly, validation properties can be combined to test the overall validation behavior rather than individual field checks.

**Property 1: Valid submissions produce complete emails**
*For any* valid contact form submission (with valid name, email, and message), the email sent via Resend should contain all three fields in the body, have a subject line containing "Contact Form Submission", use the configured from address, set reply-to to the user's email, and use HTML formatting.
**Validates: Requirements 1.1, 4.1, 4.2, 4.3, 4.4, 4.5**

**Property 2: Successful email sends return success responses**
*For any* valid form submission that successfully sends an email, the server endpoint should return a 200 status code with a success message.
**Validates: Requirements 1.2**

**Property 3: Invalid inputs are rejected with 400 errors**
*For any* form submission with missing fields, invalid email format, whitespace-only message, or fields exceeding 200 characters, the server should return a 400 status code with a descriptive error message.
**Validates: Requirements 2.1, 2.2, 2.3, 2.5**

**Property 4: Error responses never expose sensitive information**
*For any* error condition (validation failure, API error, network error), the error message returned to the client should not contain API keys, internal stack traces, or other sensitive implementation details.
**Validates: Requirements 5.3**

**Property 5: Form UI resets after successful submission**
*For any* successful form submission, the form fields should be cleared and a success message should be displayed to the user.
**Validates: Requirements 1.3**

**Property 6: Form UI shows errors after failed submission**
*For any* failed form submission (validation error or server error), an appropriate error message should be displayed to the user without clearing the form fields.
**Validates: Requirements 1.4**

## Error Handling

### Validation Errors (400)

The server endpoint will validate all inputs before attempting to send emails:

1. **Missing Fields**: Return error "All fields are required"
2. **Invalid Email**: Return error "Please provide a valid email address"
3. **Whitespace-Only Message**: Return error "Message cannot be empty"
4. **Field Too Long**: Return error "Name/Email must be 200 characters or less"

### Server Errors (500)

1. **Missing API Key**: Log error, return "Service configuration error"
2. **Resend API Error**: Log full error, return "Failed to send message. Please try again."
3. **Network Error**: Log error, return "Network error. Please check your connection."
4. **Rate Limiting**: Return "Too many requests. Please try again later."

### Error Logging

All errors will be logged to the server console with:
- Timestamp
- Error type
- Error message
- Request details (sanitized, no sensitive data)

### Client-Side Error Handling

The form handler will:
1. Catch all fetch errors
2. Parse error responses
3. Display user-friendly messages
4. Maintain form state on error (don't clear fields)
5. Re-enable submit button after error

## Testing Strategy

### Unit Testing

We will use Vitest (SvelteKit's recommended testing framework) for unit tests:

1. **Validation Function Tests**
   - Test email regex with valid/invalid formats
   - Test field length validation
   - Test whitespace trimming
   - Test missing field detection

2. **Email Formatting Tests**
   - Test HTML email template generation
   - Test subject line formatting
   - Test reply-to header setting

3. **Error Response Tests**
   - Test error message formatting
   - Test status code selection
   - Test sensitive data sanitization

### Property-Based Testing

We will use fast-check (JavaScript property-based testing library) for property tests:

1. **Property 1: Valid submissions produce complete emails**
   - Generator: Create random valid form data (names, emails, messages)
   - Test: Mock Resend API, verify email structure contains all fields
   - Iterations: 100

2. **Property 2: Successful email sends return success responses**
   - Generator: Create random valid form data
   - Test: Mock successful Resend response, verify 200 status
   - Iterations: 100

3. **Property 3: Invalid inputs are rejected with 400 errors**
   - Generator: Create random invalid form data (missing fields, bad emails, etc.)
   - Test: Verify 400 status and error message
   - Iterations: 100

4. **Property 4: Error responses never expose sensitive information**
   - Generator: Create various error conditions
   - Test: Verify response doesn't contain "RESEND_API_KEY", stack traces, etc.
   - Iterations: 100

5. **Property 5: Form UI resets after successful submission**
   - Generator: Create random valid form data
   - Test: Submit form, verify fields are empty and success message shown
   - Iterations: 50 (UI tests are slower)

6. **Property 6: Form UI shows errors after failed submission**
   - Generator: Create random invalid form data
   - Test: Submit form, verify error message shown and fields retained
   - Iterations: 50

**Configuration:**
- Each property test must run a minimum of 50-100 iterations
- Each test must be tagged with: `// Feature: resend-email-migration, Property {number}: {description}`
- Tests should use mocking for Resend API to avoid actual email sends
- UI tests will use Svelte Testing Library

### Integration Testing

1. **End-to-End Form Submission**
   - Test complete flow from form fill to success message
   - Use Playwright for browser automation
   - Test with Resend sandbox/test mode

2. **API Endpoint Integration**
   - Test actual HTTP requests to `/api/contact`
   - Verify request/response formats
   - Test with mocked Resend API

## Implementation Notes

### Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "fast-check": "^3.15.0",
    "@testing-library/svelte": "^4.0.0"
  }
}
```

### Environment Variables

Required environment variables:
- `RESEND_API_KEY`: API key from Resend dashboard
- `RESEND_FROM_EMAIL`: Verified sender email (e.g., "noreply@techieneighbor.net")
- `RESEND_TO_EMAIL`: Recipient email for contact form submissions

### Resend Setup Documentation

The implementation will include a `RESEND_SETUP.md` file with:

1. **Creating a Resend Account**
   - Visit https://resend.com
   - Click "Sign Up" and create account
   - Verify email address

2. **Obtaining API Key**
   - Log into Resend dashboard
   - Navigate to "API Keys" section
   - Click "Create API Key"
   - Name it (e.g., "TechieNeighbor Production")
   - Select permissions (Send emails)
   - Copy the API key (shown only once)
   - Store securely

3. **Verifying Sending Domain**
   - Navigate to "Domains" in dashboard
   - Click "Add Domain"
   - Enter your domain (e.g., techieneighbor.net)
   - Add DNS records provided by Resend:
     - SPF record - **IMPORTANT**: If you already have an SPF record for ProtonMail, you'll need to merge them. SPF records must include all email services. Example: `v=spf1 include:_spf.protonmail.ch include:_spf.resend.com ~all`
     - DKIM record - This is service-specific and won't conflict. Resend will provide a unique selector (e.g., `resend._domainkey`)
     - DMARC record (optional but recommended) - If you already have one, no changes needed
   - Wait for verification (usually 5-10 minutes)
   - Verify status shows "Verified"
   - **Note**: Adding Resend to your domain will NOT break ProtonMail. Both services can coexist by properly configuring DNS records. The SPF record tells receiving servers that both ProtonMail and Resend are authorized to send email from your domain.

4. **Local Development Setup**
   - Create `.env.local` file in project root
   - Add variables:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     RESEND_FROM_EMAIL=noreply@techieneighbor.net
     RESEND_TO_EMAIL=your-email@example.com
     ```
   - Add `.env.local` to `.gitignore`

5. **Vercel Production Setup**
   - Open Vercel project dashboard
   - Navigate to "Settings" → "Environment Variables"
   - Add each variable:
     - Name: `RESEND_API_KEY`
     - Value: Your production API key
     - Environment: Production (and Preview if needed)
   - Repeat for `RESEND_FROM_EMAIL` and `RESEND_TO_EMAIL`
   - Redeploy application

6. **Testing Email Delivery**
   - Use Resend's test mode for development
   - Check Resend dashboard "Logs" section for delivery status
   - Verify emails arrive in inbox
   - Check spam folder if not received
   - Review email headers and formatting

### Migration Checklist

1. Install Resend SDK
2. Create server endpoint
3. Implement validation logic
4. Implement email sending
5. Update client-side form handler
6. Add error handling
7. Write tests
8. Create setup documentation
9. Configure environment variables
10. Test in development
11. Deploy to production
12. Verify production emails
13. Remove Formspree references

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables exclusively
   - Rotate keys if exposed

2. **Input Sanitization**
   - Validate all inputs server-side
   - Trim whitespace
   - Limit field lengths
   - Validate email format

3. **Rate Limiting**
   - Consider adding rate limiting to prevent abuse
   - Use Vercel's built-in rate limiting or custom middleware
   - Limit to 5 submissions per IP per hour

4. **CORS**
   - Endpoint only accepts POST requests
   - No CORS headers needed (same-origin)

5. **Error Messages**
   - Never expose internal errors to clients
   - Sanitize all error responses
   - Log detailed errors server-side only

## Performance Considerations

1. **Response Time**
   - Resend API typically responds in 100-300ms
   - Total form submission should complete in < 1 second
   - Show loading state during submission

2. **Error Recovery**
   - Implement exponential backoff for retries
   - Cache form data in case of network errors
   - Provide clear feedback to users

3. **Monitoring**
   - Log all email sends with timestamps
   - Monitor Resend dashboard for delivery rates
   - Set up alerts for high error rates
