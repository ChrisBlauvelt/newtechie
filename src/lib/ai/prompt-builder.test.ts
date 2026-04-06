import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from './prompt-builder';
import { KNOWLEDGE_BASE } from './knowledge-base';

describe('buildSystemPrompt', () => {
  it('should generate a system prompt with all required sections', () => {
    const prompt = buildSystemPrompt(KNOWLEDGE_BASE);
    
    // Verify company information is included
    expect(prompt).toContain('TechieNeighbor');
    expect(prompt).toContain('Gwinnett County and Metro Atlanta');
    
    // Verify brand identity is included
    expect(prompt).toContain('BRAND IDENTITY:');
    expect(prompt).toContain('Personal touch and custom solutions');
    expect(prompt).toContain('Trusted local expert');
    
    // Verify all four services are included
    expect(prompt).toContain('Custom Website Development');
    expect(prompt).toContain('Smart Home Automation');
    expect(prompt).toContain('Local SEO & Marketing');
    expect(prompt).toContain('Website Maintenance');
    
    // Verify contact information is included
    expect(prompt).toContain('CONTACT:');
    expect(prompt).toContain('470-962-1059');
    
    // Verify instructions are included
    expect(prompt).toContain('INSTRUCTIONS:');
    expect(prompt).toContain('friendly, helpful, and professional');
    expect(prompt).toContain('warm, neighborly tone');
  });
  
  it('should include service features and benefits', () => {
    const prompt = buildSystemPrompt(KNOWLEDGE_BASE);
    
    // Check that features are included
    expect(prompt).toContain('Key features:');
    expect(prompt).toContain('Responsive web design');
    
    // Check that benefits are included
    expect(prompt).toContain('Benefits:');
    expect(prompt).toContain('Increased online visibility');
  });
  
  it('should include response guidelines', () => {
    const prompt = buildSystemPrompt(KNOWLEDGE_BASE);
    
    expect(prompt).toContain('Keep responses concise (2-3 paragraphs maximum)');
    expect(prompt).toContain('custom quotes are provided based on project scope');
    expect(prompt).toContain('suggest contacting TechieNeighbor directly');
  });
});
