# Requirements Document

## Introduction

The Admin Newsletter Dashboard is a secure, admin-only interface for managing monthly newsletter content. The system allows the site owner to authenticate via Supabase, upload markdown files containing newsletter content, and manage the newsletter archive. This feature integrates with the existing Klaviyo newsletter signup forms and Resend email service to enable a complete monthly newsletter workflow.

## Glossary

- **Admin_Dashboard**: The secure web interface accessible only to authenticated administrators
- **Newsletter_Content**: Markdown files containing the monthly newsletter text and formatting
- **Supabase_Auth**: The authentication service that verifies admin identity
- **Content_Manager**: The component responsible for storing, retrieving, and managing newsletter files
- **Email_Service**: The service (Resend or Klaviyo) that sends newsletters to subscribers
- **Subscriber_List**: The collection of email addresses from Klaviyo newsletter signups
- **Markdown_File**: A .md file containing formatted newsletter content
- **Newsletter_Archive**: The historical collection of all published newsletters

## Requirements

### Requirement 1: Admin Authentication

**User Story:** As the site owner, I want to securely log into an admin dashboard, so that only I can manage newsletter content.

#### Acceptance Criteria

1. WHEN an unauthenticated user visits the admin dashboard URL, THE System SHALL redirect them to a login page
2. WHEN a user submits valid admin credentials, THE Supabase_Auth SHALL authenticate the user and grant access to the Admin_Dashboard
3. WHEN a user submits invalid credentials, THE Supabase_Auth SHALL reject the login attempt and display an error message
4. WHEN an authenticated admin session expires, THE System SHALL redirect the user to the login page
5. THE System SHALL restrict admin access to a single predefined admin user account
6. WHEN an admin logs out, THE System SHALL clear the authentication session and redirect to the login page

### Requirement 2: Newsletter File Upload

**User Story:** As an admin, I want to upload markdown files for newsletters, so that I can prepare monthly newsletter content.

#### Acceptance Criteria

1. WHEN an authenticated admin accesses the upload interface, THE Admin_Dashboard SHALL display a file upload form
2. WHEN an admin selects a .md file for upload, THE System SHALL validate that the file extension is .md
3. WHEN an admin uploads a valid markdown file, THE Content_Manager SHALL store the file with metadata including upload date and filename
4. WHEN an admin attempts to upload a non-markdown file, THE System SHALL reject the upload and display an error message
5. WHEN a markdown file is successfully uploaded, THE System SHALL display a success confirmation
6. THE System SHALL limit file uploads to a maximum size of 5MB per file
7. WHEN an admin uploads a file with a duplicate name, THE System SHALL prompt for confirmation before overwriting

### Requirement 3: Newsletter Content Management

**User Story:** As an admin, I want to view, edit, and delete newsletter files, so that I can manage the newsletter archive.

#### Acceptance Criteria

1. WHEN an authenticated admin accesses the dashboard, THE Admin_Dashboard SHALL display a list of all uploaded newsletter files
2. WHEN displaying newsletter files, THE System SHALL show the filename, upload date, and file size for each entry
3. WHEN an admin clicks on a newsletter file, THE Admin_Dashboard SHALL display the rendered markdown content
4. WHEN an admin selects a newsletter for editing, THE Admin_Dashboard SHALL provide an interface to modify the markdown content
5. WHEN an admin saves edited content, THE Content_Manager SHALL update the stored file and preserve the original upload date
6. WHEN an admin deletes a newsletter file, THE System SHALL prompt for confirmation before permanent deletion
7. WHEN a newsletter file is deleted, THE Content_Manager SHALL remove it from storage and update the displayed list

### Requirement 4: Newsletter Distribution Integration

**User Story:** As an admin, I want to send newsletters to subscribers, so that I can distribute monthly content to my audience.

#### Acceptance Criteria

1. WHEN an admin selects a newsletter for distribution, THE Admin_Dashboard SHALL display subscriber count from the Subscriber_List
2. WHEN an admin initiates newsletter distribution, THE System SHALL retrieve all subscriber emails from Klaviyo
3. WHEN sending a newsletter, THE Email_Service SHALL convert the markdown content to HTML email format
4. WHEN distributing a newsletter, THE System SHALL send the email to all subscribers in the Subscriber_List
5. WHEN newsletter distribution completes, THE System SHALL display a summary including total sent, successful deliveries, and any failures
6. THE System SHALL prevent duplicate sends of the same newsletter within a 24-hour period
7. WHEN a newsletter send fails for specific subscribers, THE System SHALL log the failures and display them to the admin

### Requirement 5: Dashboard Security

**User Story:** As the site owner, I want the admin dashboard to be secure, so that unauthorized users cannot access or modify newsletter content.

#### Acceptance Criteria

1. THE System SHALL enforce HTTPS for all admin dashboard pages
2. WHEN an authentication token is issued, THE Supabase_Auth SHALL set an expiration time of 24 hours
3. WHEN an admin performs any action, THE System SHALL validate the authentication token before processing
4. THE System SHALL implement rate limiting of 5 failed login attempts per IP address per hour
5. WHEN rate limiting is triggered, THE System SHALL temporarily block login attempts from that IP address for 1 hour
6. THE System SHALL log all admin actions including uploads, edits, deletions, and newsletter sends
7. WHEN storing admin credentials, THE Supabase_Auth SHALL use secure password hashing

### Requirement 6: Newsletter Archive Display

**User Story:** As an admin, I want to organize newsletters by date, so that I can easily find and manage past content.

#### Acceptance Criteria

1. WHEN displaying the newsletter list, THE Admin_Dashboard SHALL sort newsletters by upload date in descending order
2. WHEN an admin searches for a newsletter, THE System SHALL filter results by filename or content keywords
3. THE Admin_Dashboard SHALL display newsletters in a paginated view with 10 items per page
4. WHEN an admin filters by date range, THE System SHALL display only newsletters within the specified dates
5. THE Admin_Dashboard SHALL provide a preview of the first 200 characters of each newsletter in the list view

### Requirement 7: Markdown Rendering

**User Story:** As an admin, I want to preview how newsletters will appear, so that I can verify formatting before sending.

#### Acceptance Criteria

1. WHEN displaying newsletter content, THE System SHALL render markdown syntax into formatted HTML
2. THE System SHALL support standard markdown features including headers, lists, links, bold, italic, and code blocks
3. WHEN rendering markdown for email, THE System SHALL convert it to email-compatible HTML with inline styles
4. WHEN previewing a newsletter, THE Admin_Dashboard SHALL display both the raw markdown and rendered HTML views
5. THE System SHALL sanitize HTML output to prevent XSS attacks

### Requirement 8: Integration with Existing Infrastructure

**User Story:** As a developer, I want the newsletter dashboard to integrate seamlessly with existing services, so that the system is maintainable and consistent.

#### Acceptance Criteria

1. THE System SHALL use the existing Resend API configuration for sending newsletter emails
2. THE System SHALL retrieve subscriber emails from the existing Klaviyo integration
3. THE Admin_Dashboard SHALL follow the existing SvelteKit routing conventions
4. THE System SHALL use the existing Tailwind CSS styling system for consistent UI
5. THE System SHALL deploy to Vercel using the existing deployment configuration
6. THE System SHALL store environment variables using the existing .env.local pattern for development
7. WHEN deployed to production, THE System SHALL use Vercel environment variables for sensitive configuration
