import { describe, it, expect, beforeEach } from 'vitest';
import { __validateFormData, __formatEmail } from './+server.js';

describe('Email Validation (Task 5.1)', () => {
	describe('Valid email formats', () => {
		it('should accept standard email format', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept email with dots in local part', () => {
			const data = {
				name: 'John Doe',
				email: 'john.doe@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept email with plus sign', () => {
			const data = {
				name: 'John Doe',
				email: 'john+test@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept email with subdomain', () => {
			const data = {
				name: 'John Doe',
				email: 'john@mail.example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept email with numbers', () => {
			const data = {
				name: 'John Doe',
				email: 'john123@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});
	});

	describe('Invalid email formats', () => {
		it('should reject email missing @ symbol', () => {
			const data = {
				name: 'John Doe',
				email: 'johnexample.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});

		it('should reject email with multiple @ symbols', () => {
			const data = {
				name: 'John Doe',
				email: 'john@@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});

		it('should reject email with invalid domain (no TLD)', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});

		it('should reject email with spaces', () => {
			const data = {
				name: 'John Doe',
				email: 'john doe@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});

		it('should reject email starting with @', () => {
			const data = {
				name: 'John Doe',
				email: '@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});

		it('should reject email ending with @', () => {
			const data = {
				name: 'John Doe',
				email: 'john@',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Please provide a valid email address');
		});
	});
});

describe('Field Validation (Task 5.2)', () => {
	describe('Required field detection', () => {
		it('should reject when name is missing', () => {
			const data = {
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject when email is missing', () => {
			const data = {
				name: 'John Doe',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject when message is missing', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject when all fields are missing', () => {
			const data = {};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject when name is null', () => {
			const data = {
				name: null,
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject when name is undefined', () => {
			const data = {
				name: undefined,
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});
	});

	describe('Field length validation', () => {
		it('should accept name at exactly 200 characters', () => {
			const data = {
				name: 'a'.repeat(200),
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should reject name exceeding 200 characters', () => {
			const data = {
				name: 'a'.repeat(201),
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Name must be 200 characters or less');
		});

		it('should accept email at exactly 200 characters', () => {
			const localPart = 'a'.repeat(189); // 189 + @ + example.com (11) = 201, but we need 200
			const data = {
				name: 'John Doe',
				email: `${'a'.repeat(188)}@example.com`, // 188 + 1 + 11 = 200
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should reject email exceeding 200 characters', () => {
			const data = {
				name: 'John Doe',
				email: `${'a'.repeat(189)}@example.com`, // 189 + 1 + 11 = 201
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('Email must be 200 characters or less');
		});

		it('should accept very long messages (no max length)', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'a'.repeat(10000)
			};
			expect(_validateFormData(data)).toBeNull();
		});
	});

	describe('Whitespace trimming and rejection', () => {
		it('should accept name with leading/trailing whitespace after trim', () => {
			const data = {
				name: '  John Doe  ',
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept email with leading/trailing whitespace after trim', () => {
			const data = {
				name: 'John Doe',
				email: '  john@example.com  ',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should accept message with leading/trailing whitespace after trim', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: '  Test message  '
			};
			expect(_validateFormData(data)).toBeNull();
		});

		it('should reject name that is only whitespace', () => {
			const data = {
				name: '   ',
				email: 'john@example.com',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject email that is only whitespace', () => {
			const data = {
				name: 'John Doe',
				email: '   ',
				message: 'Test message'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject message that is only whitespace', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: '   '
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject message with tabs only', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: '\t\t\t'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});

		it('should reject message with newlines only', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: '\n\n\n'
			};
			expect(_validateFormData(data)).toBe('All fields are required');
		});
	});
});

describe('Email Template Formatting (Task 5.3)', () => {
	// Store original env vars
	let originalFromEmail;
	let originalToEmail;

	beforeEach(() => {
		originalFromEmail = process.env.RESEND_FROM_EMAIL;
		originalToEmail = process.env.RESEND_TO_EMAIL;
		// Set test env vars
		process.env.RESEND_FROM_EMAIL = 'test@techieneighbor.net';
		process.env.RESEND_TO_EMAIL = 'recipient@techieneighbor.net';
	});

	describe('HTML email generation', () => {
		it('should generate HTML email with all user data', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'This is a test message'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('John Doe');
			expect(result.html).toContain('john@example.com');
			expect(result.html).toContain('This is a test message');
			expect(result.html).toContain('<!DOCTYPE html>');
			expect(result.html).toContain('<html>');
		});

		it('should include proper HTML structure', () => {
			const data = {
				name: 'Jane Smith',
				email: 'jane@example.com',
				message: 'Hello world'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('<head>');
			expect(result.html).toContain('<body>');
			expect(result.html).toContain('<style>');
			expect(result.html).toContain('</html>');
		});

		it('should trim whitespace from input fields', () => {
			const data = {
				name: '  John Doe  ',
				email: '  john@example.com  ',
				message: '  Test message  '
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('John Doe');
			expect(result.html).toContain('john@example.com');
			expect(result.html).toContain('Test message');
			expect(result.html).not.toContain('  John Doe  ');
		});

		it('should convert newlines to <br> tags in message', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Line 1\nLine 2\nLine 3'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('Line 1<br>Line 2<br>Line 3');
		});

		it('should include styling for better readability', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('font-family');
			expect(result.html).toContain('color');
			expect(result.html).toContain('#14b8a6'); // Brand color
		});
	});

	describe('Subject line formatting', () => {
		it('should format subject with user name', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test message'
			};
			const result = _formatEmail(data);

			expect(result.subject).toBe('Contact Form Submission from John Doe');
		});

		it('should format subject with trimmed name', () => {
			const data = {
				name: '  Jane Smith  ',
				email: 'jane@example.com',
				message: 'Test message'
			};
			const result = _formatEmail(data);

			expect(result.subject).toBe('Contact Form Submission from Jane Smith');
		});

		it('should handle names with special characters', () => {
			const data = {
				name: "O'Brien",
				email: 'obrien@example.com',
				message: 'Test message'
			};
			const result = _formatEmail(data);

			expect(result.subject).toBe("Contact Form Submission from O'Brien");
		});

		it('should handle names with accents', () => {
			const data = {
				name: 'José García',
				email: 'jose@example.com',
				message: 'Test message'
			};
			const result = _formatEmail(data);

			expect(result.subject).toBe('Contact Form Submission from José García');
		});
	});

	describe('Special character handling', () => {
		it('should handle apostrophes in name', () => {
			const data = {
				name: "O'Connor",
				email: 'oconnor@example.com',
				message: 'Test message'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain("O'Connor");
			expect(result.subject).toContain("O'Connor");
		});

		it('should handle quotes in message', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'He said "hello" to me'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('He said "hello" to me');
		});

		it('should handle ampersands in message', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Smith & Jones Company'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('Smith & Jones Company');
		});

		it('should handle less than and greater than symbols', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: '5 < 10 and 10 > 5'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('5 < 10 and 10 > 5');
		});

		it('should handle unicode characters', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Hello 👋 World 🌍'
			};
			const result = _formatEmail(data);

			expect(result.html).toContain('Hello 👋 World 🌍');
		});
	});

	describe('Email configuration', () => {
		it('should set correct from address', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.from).toBe('test@techieneighbor.net');
		});

		it('should set correct to address', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.to).toBe('recipient@techieneighbor.net');
		});

		it('should set replyTo to user email', () => {
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.replyTo).toBe('john@example.com');
		});

		it('should trim replyTo email', () => {
			const data = {
				name: 'John Doe',
				email: '  john@example.com  ',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.replyTo).toBe('john@example.com');
		});

		it('should use default from address if env var not set', () => {
			delete process.env.RESEND_FROM_EMAIL;
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.from).toBe('noreply@techieneighbor.net');
			
			// Restore
			process.env.RESEND_FROM_EMAIL = originalFromEmail;
		});

		it('should use default to address if env var not set', () => {
			delete process.env.RESEND_TO_EMAIL;
			const data = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test'
			};
			const result = _formatEmail(data);

			expect(result.to).toBe('contact@techieneighbor.net');
			
			// Restore
			process.env.RESEND_TO_EMAIL = originalToEmail;
		});
	});
});
