/**
 * System Prompt Builder for TechieNeighbor AI Spotlight Component
 * 
 * This module builds the system prompt that provides context to the AI
 * about TechieNeighbor's services, brand identity, and response guidelines.
 */

import type { KnowledgeBase } from './knowledge-base';

/**
 * Builds a comprehensive system prompt from the knowledge base
 * 
 * The system prompt includes:
 * - Company brand identity and values
 * - Detailed service information with features and benefits
 * - Contact information and service area
 * - Response tone and behavior guidelines
 * - Fallback instructions for unknown questions
 * 
 * @param kb - The knowledge base containing TechieNeighbor information
 * @returns A formatted system prompt string for the AI
 */
export function buildSystemPrompt(kb: KnowledgeBase): string {
  return `You are an AI assistant for ${kb.company.name}, a technology services company serving ${kb.company.location}.

BRAND IDENTITY:
${kb.company.brandIdentity.map(item => `- ${item}`).join('\n')}

SERVICES OFFERED:
${Object.values(kb.services).map(service => `
${service.name}:
${service.description}
Key features: ${service.features.join(', ')}
Benefits: ${service.benefits.join(', ')}
`).join('\n')}

CONTACT:
Phone: ${kb.contact.phone}
Service Area: ${kb.contact.serviceArea.join(', ')}

INSTRUCTIONS:
- Be friendly, helpful, and professional
- Emphasize the personal touch and custom solutions
- Focus on how services benefit local businesses and homeowners
- If asked about pricing, explain that custom quotes are provided based on project scope
- If you don't know something, suggest contacting TechieNeighbor directly
- Keep responses concise (2-3 paragraphs maximum)
- Use specific examples when relevant
- Always maintain a warm, neighborly tone`;
}
