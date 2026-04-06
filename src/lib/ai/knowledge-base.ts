/**
 * Knowledge Base for TechieNeighbor AI Spotlight Component
 * 
 * This module contains structured information about TechieNeighbor's services,
 * company information, and brand identity. It serves as the context source
 * for AI-powered responses in the chat interface.
 */

export interface ServiceInfo {
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  targetAudience: string[];
  examples: string[];
}

export interface KnowledgeBase {
  company: {
    name: string;
    tagline: string;
    location: string;
    brandIdentity: string[];
  };
  services: {
    webDevelopment: ServiceInfo;
    smartHome: ServiceInfo;
    localSEO: ServiceInfo;
    hardwareInstallation: ServiceInfo;
    aiIntegration: ServiceInfo;
    managedServices: ServiceInfo;
    socialMediaManagement: ServiceInfo;
  };
  technologies: {
    frontend: string[];
    backend: string[];
    deployment: string[];
  };
  pricing: {
    approach: string;
    factors: string[];
    smallBusinessPackages: Array<{
      name: string;
      price: string;
      description: string;
      includes: string[];
    }>;
  };
  contact: {
    phone: string;
    serviceArea: string[];
  };
}

export const KNOWLEDGE_BASE: KnowledgeBase = {
  company: {
    name: "TechieNeighbor",
    tagline: "Custom Tech Solutions Crafted with Care",
    location: "Gwinnett County and Metro Atlanta",
    brandIdentity: [
      "Personal touch and custom solutions",
      "Trusted local expert",
      "Community-focused service",
      "Care and expertise"
    ]
  },
  services: {
    webDevelopment: {
      name: "Custom Website Development",
      description: "Professional web development for local businesses, from startups to established enterprises",
      features: [
        "Responsive web design",
        "Local SEO optimization",
        "E-commerce integration",
        "Custom web applications",
        "SvelteKit and modern frameworks"
      ],
      benefits: [
        "Increased online visibility",
        "Better customer engagement",
        "Mobile-friendly experience",
        "Fast loading times",
        "Integrated analytics"
      ],
      targetAudience: [
        "Local businesses in Gwinnett County",
        "Small to medium-sized enterprises",
        "Restaurants and retail",
        "Professional services"
      ],
      examples: [
        "Restaurant websites with online ordering",
        "Business portfolios with contact forms",
        "E-commerce stores with payment integration"
      ]
    },
    smartHome: {
      name: "Smart Home Automation",
      description: "Custom smart home solutions and home improvement technology",
      features: [
        "Home Assistant integration",
        "Custom automation workflows",
        "Voice control setup",
        "Energy monitoring",
        "Security system integration"
      ],
      benefits: [
        "Increased home efficiency",
        "Energy cost savings",
        "Enhanced security",
        "Convenience and comfort",
        "Property value increase"
      ],
      targetAudience: [
        "Homeowners in Gwinnett County",
        "Tech-savvy residents",
        "Energy-conscious families"
      ],
      examples: [
        "Automated lighting and climate control",
        "Smart security cameras and locks",
        "Voice-controlled home systems"
      ]
    },
    localSEO: {
      name: "Local SEO & Marketing",
      description: "Targeted local SEO and marketing strategies for Metro Atlanta businesses",
      features: [
        "Google Business Profile optimization",
        "Local directory listings",
        "Content marketing",
        "Review management",
        "Local keyword targeting"
      ],
      benefits: [
        "Higher local search rankings",
        "More qualified leads",
        "Increased foot traffic",
        "Better online reputation",
        "Competitive advantage"
      ],
      targetAudience: [
        "Local businesses seeking visibility",
        "Service providers in Metro Atlanta",
        "Retail stores and restaurants"
      ],
      examples: [
        "Google Maps optimization",
        "Local content creation",
        "Citation building"
      ]
    },
    hardwareInstallation: {
      name: "Hardware Installation and Maintenance",
      description: "Professional hardware setup and ongoing maintenance for business infrastructure",
      features: [
        "UniFi networking and security physical installations",
        "Hardware repairs and software monitoring for desktop and server",
        "Printer installation and configuration",
        "Network infrastructure setup",
        "Server maintenance and monitoring"
      ],
      benefits: [
        "Reliable network infrastructure",
        "Reduced downtime",
        "Professional installation",
        "Ongoing support and monitoring",
        "Optimized hardware performance"
      ],
      targetAudience: [
        "Small to medium businesses",
        "Offices requiring network setup",
        "Businesses needing IT infrastructure"
      ],
      examples: [
        "UniFi access point installation",
        "Business network configuration",
        "Server setup and monitoring"
      ]
    },
    aiIntegration: {
      name: "AI Integration & Local Document Processing",
      description: "Secure, local document processing solutions with AI and Large Language Models",
      features: [
        "Customizable hardware packages for any budget",
        "Tools set up and customized for business document types",
        "OCR (optical character recognition) applications",
        "Offline, local, and secure document chat",
        "Private AI deployment"
      ],
      benefits: [
        "Data privacy and security",
        "No cloud dependency",
        "Custom AI solutions",
        "Document accessibility",
        "Improved workflow efficiency"
      ],
      targetAudience: [
        "Businesses with sensitive documents",
        "Legal and medical offices",
        "Companies requiring data privacy",
        "Organizations with large document archives"
      ],
      examples: [
        "Local LLM deployment for document Q&A",
        "OCR processing for scanned documents",
        "Private AI chatbot for business documents"
      ]
    },
    managedServices: {
      name: "Business Software Administration & Managed Services",
      description: "Comprehensive managed services with dedicated helpdesk support for essential business software",
      features: [
        "Autodesk administration and support",
        "Microsoft Office 365 management",
        "Adobe Creative Cloud support",
        "Toast POS system support",
        "Square payment system support",
        "Clover POS support",
        "QuickBooks administration",
        "Helpdesk availability"
      ],
      benefits: [
        "Expert software support",
        "Reduced IT overhead",
        "Quick issue resolution",
        "Software optimization",
        "User training and onboarding"
      ],
      targetAudience: [
        "Restaurants using Toast, Square, or Clover",
        "Design firms using Autodesk or Adobe",
        "Businesses using Office 365",
        "Companies using QuickBooks"
      ],
      examples: [
        "Office 365 user management",
        "Toast POS troubleshooting",
        "QuickBooks setup and training"
      ]
    },
    socialMediaManagement: {
      name: "Social Media & Digital Storefront Management",
      description: "Professional social media and Google Business Profile management with custom digital storefronts",
      features: [
        "Social media management and content strategy",
        "Google Business Profile optimization and management",
        "Custom applications for unique digital storefronts",
        "Content creation and scheduling",
        "Online reputation management",
        "Custom web applications"
      ],
      benefits: [
        "Consistent online presence",
        "Improved local visibility",
        "Professional brand image",
        "Increased customer engagement",
        "Unique digital identity"
      ],
      targetAudience: [
        "Local businesses seeking online presence",
        "Restaurants and retail stores",
        "Service providers",
        "Businesses needing custom solutions"
      ],
      examples: [
        "Google Business Profile optimization",
        "Social media content calendar",
        "Custom booking applications"
      ]
    }
  },
  technologies: {
    frontend: ["SvelteKit", "Svelte", "Tailwind CSS", "TypeScript"],
    backend: ["Node.js", "Vercel Functions", "API integrations"],
    deployment: ["Vercel", "CDN", "Edge Functions"]
  },
  pricing: {
    approach: "Custom quotes based on project scope, with packaged solutions for small businesses",
    factors: [
      "Project complexity",
      "Timeline requirements",
      "Ongoing maintenance needs",
      "Integration requirements"
    ],
    smallBusinessPackages: [
      {
        name: "Essential",
        price: "$299/month",
        description: "Perfect for new small businesses getting started with their digital presence",
        includes: [
          "Custom website build",
          "Hosting & maintenance",
          "Mobile-responsive design",
          "Basic SEO optimization",
          "2 social media posts per month",
          "Email support"
        ]
      },
      {
        name: "Hometown Hero",
        price: "$399/month",
        description: "Most popular package for growing small businesses",
        includes: [
          "Everything in Essential",
          "Priority support",
          "Advanced SEO optimization",
          "4 social media posts per month",
          "Hardware support (POS, tablets)",
          "Network monitoring",
          "Google Business Profile management"
        ]
      },
      {
        name: "Scale to the Moon",
        price: "$599/month",
        description: "Enterprise solution for small businesses ready to dominate their market",
        includes: [
          "Everything in Hometown Hero",
          "Daily monitoring & updates",
          "8 social media posts per month",
          "Full IT infrastructure support",
          "POS system integration",
          "Online ordering integration",
          "Custom web features & integrations",
          "Unlimited device support"
        ]
      }
    ]
  },
  contact: {
    phone: "470-962-1059",
    serviceArea: ["Gwinnett County", "Metro Atlanta", "North Georgia"]
  }
};
