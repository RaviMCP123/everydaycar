import { STATIC_PAGE_TEMPLATES } from "./staticPageTemplates";

export interface TemplateField {
  key: string;
  type: "text" | "richText" | "image" | "imageArray" | "pdf" | "link" | "select";
  label: string;
  required?: boolean;
  multilingual?: boolean; // Default: true
  placeholder?: string;
  helpText?: string;
  options?: Array<{ label: string; value: string }>;
  showWhen?: { key: string; equals: string };
  /** When true (home section CTAs only), SimpleTemplateEditor shows page picker + manual URL. */
  selectPageForRedirect?: boolean;
}

export interface PageTemplate {
  key: string;
  name: string;
  description?: string;
  fields: TemplateField[];
  sampleContent?: Record<string, any>; // Sample/dummy content for this template
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: "PAGE_TEMPLATE_V1",
    name: "Page Template",
    description: "Dynamic template for creating pages with customizable sections (title, subtitle, description, images). Add as many sections as needed.",
    fields: [], // Dynamic template - sections are added by admin
    sampleContent: {
      // Sample banner data for demonstration
      bannerTitle: { en: "Welcome to Our Platform" },
      bannerDescription: { 
        en: "<p>This is a sample banner description. You can customize this content to create an engaging introduction for your page. The banner appears at the top of your page and helps set the tone for your content.</p>" 
      },
      // Sample page sections for demonstration
      pageSections: [
        {
          title: { en: "Banner Section" },
          subtitle: { en: "Welcome to Our Platform" },
          description: { 
            en: "<p>This is a sample banner section with a title, subtitle, and description. You can customize this content and add images to make it more engaging.</p>" 
          },
          images: ["/assets/img/termly/designed_for_simplicity.png"],
        },
        {
          title: { en: "Overview Section" },
          subtitle: { en: "What We Offer" },
          description: { 
            en: "<p>This section provides an overview of our services and features. You can add multiple images here (up to 3) to showcase your offerings.</p><p>Each section can have its own title, subtitle, description, and images.</p>" 
          },
          images: ["/assets/img/termly/structured_payment_support_platform.png"],
        },
        {
          title: { en: "Features Section" },
          description: { 
            en: "<p>Highlight your key features and benefits in this section. The subtitle is optional, so you can skip it if you don't need it.</p><p>You can add up to 3 images per section to make your content more visual and engaging.</p>" 
          },
          images: ["/assets/img/termly/built_around_your_operations.png"],
        },
      ],
    },
  },
  {
    key: "INNER_PAGE_V1",
    name: "Inner Page Template",
    description:
      "Inner page layout with 2 required images (top row), required left text, and an optional third right block as image or logo with link.",
    fields: [
      {
        key: "topLeftImage",
        type: "image",
        label: "Top Left Image",
        required: true,
      },
      {
        key: "topRightImage",
        type: "image",
        label: "Top Right Image",
        required: true,
      },
      {
        key: "bottomLeftText",
        type: "richText",
        label: "Left Text Content",
        required: true,
        placeholder: "Add the inner page text content...",
      },
      {
        key: "thirdRightType",
        type: "select",
        label: "Third Right Block Type",
        required: true,
        multilingual: false,
        options: [
          { label: "Image", value: "image" },
          { label: "Logos with links", value: "logos" },
        ],
      },
      {
        key: "thirdImage",
        type: "image",
        label: "Third Right Image",
        required: false,
        showWhen: { key: "thirdRightType", equals: "image" },
      },
      {
        key: "logo1Image",
        type: "image",
        label: "Logo 1",
        required: true,
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo1Url",
        type: "link",
        label: "Logo 1 Link",
        required: true,
        multilingual: false,
        placeholder: "https://example.com/",
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo2Image",
        type: "image",
        label: "Logo 2",
        required: true,
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo2Url",
        type: "link",
        label: "Logo 2 Link",
        required: true,
        multilingual: false,
        placeholder: "https://example.com/",
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo3Image",
        type: "image",
        label: "Logo 3 (Optional)",
        required: false,
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo3Url",
        type: "link",
        label: "Logo 3 Link (Optional)",
        multilingual: false,
        required: false,
        placeholder: "https://example.com/",
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo4Image",
        type: "image",
        label: "Logo 4 (Optional)",
        required: false,
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
      {
        key: "logo4Url",
        type: "link",
        label: "Logo 4 Link (Optional)",
        multilingual: false,
        required: false,
        placeholder: "https://example.com/",
        showWhen: { key: "thirdRightType", equals: "logos" },
      },
    ],
    sampleContent: {
      thirdRightType: "logos",
      bottomLeftText: {
        en: "<h4>These days, you can do just about anything online—even visit your doctor. So why do you still need to drive across town just to get someone to notarize a document?</h4><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In natus accusamus id dicta saepe quae illo, fugit perferendis ipsa tempora magni eius debitis asperiores, iste qui, commodi sed?</p>",
      },
      logo1Url: "https://termly.com.au/",
      logo2Url: "https://toyride.com/",
      logo3Url: "https://coveryou.com/",
      logo4Url: "https://everydaycar.com/",
    },
  },
  {
    key: "HOME_TEMPLATE_V1",
    name: "Home Template",
    description:
      "Controls all text and images on the home page. Sections: Hero Banner → Trust Bar → What We Do → Our Network (auto from manager) → Join CTA.",
    fields: [
      // ── HERO BANNER ──────────────────────────────────────────
      {
        key: "heroImage",
        type: "image",
        label: "Banner Background Image",
        helpText: "Full-width background photo behind the hero text.",
        required: false,
        multilingual: false,
      },
      {
        key: "heroKicker",
        type: "text",
        label: "Banner Eyebrow Text (small line above title)",
        helpText: "Small uppercase label displayed above the main heading.",
        required: false,
        placeholder: "Australia's Premier Accident Repair Network",
      },
      {
        key: "heroTitleLine1",
        type: "text",
        label: "Banner Heading – Line 1 (white)",
        required: true,
        placeholder: "Australia's Trusted",
      },
      {
        key: "heroTitleLine2",
        type: "text",
        label: "Banner Heading – Line 2 (blue highlight)",
        required: true,
        placeholder: "Accident Repair Network",
      },
      {
        key: "heroSubtitle",
        type: "text",
        label: "Banner Subtext (paragraph below heading)",
        required: true,
        placeholder:
          "Providing the right solution first time, every time. From driveable repairs to full accident management - we handle it all.",
      },
      {
        key: "heroPrimaryButtonText",
        type: "text",
        label: "Banner Primary Button Label",
        required: true,
        placeholder: "Book a Repair",
      },
      {
        key: "heroPrimaryButtonLink",
        type: "link",
        label: "Banner Primary Button Link",
        required: true,
        multilingual: false,
        placeholder: "/book-a-repair",
        selectPageForRedirect: true,
      },
      {
        key: "heroSecondaryButtonText",
        type: "text",
        label: "Banner Secondary Button Label",
        required: true,
        placeholder: "Find Your Nearest Repairer",
      },
      {
        key: "heroSecondaryButtonLink",
        type: "link",
        label: "Banner Secondary Button Link",
        required: true,
        multilingual: false,
        placeholder: "/find-a-repairer",
        selectPageForRedirect: true,
      },
      ...[1, 2, 3, 4].flatMap((index): TemplateField[] => [
        {
          key: `heroBadge${index}Image`,
          type: "image",
          label: `Banner Rating/Badge Image ${index}`,
          helpText: index === 1 ? "Small rating or partner logo shown below the CTA buttons in the banner." : undefined,
          required: false,
          multilingual: false,
        },
      ]),
      // ── TRUST BAR (blue strip below banner) ──────────────────
      {
        key: "trustBarTitle",
        type: "text",
        label: "Trust Bar – Heading",
        helpText: "Left-side bold text on the blue trust bar strip.",
        required: true,
        placeholder: "Trusted by drivers across Victoria",
      },
      ...[1, 2, 3, 4].flatMap((index): TemplateField[] => [
        {
          key: `trustItem${index}Icon`,
          type: "image",
          label: `Trust Bar – Item ${index} Icon`,
          helpText: "Small icon inside the circular badge.",
          required: false,
          multilingual: false,
        },
        {
          key: `trustItem${index}Label`,
          type: "text",
          label: `Trust Bar – Item ${index} Label`,
          required: true,
          placeholder: index === 1 ? "Authorised Repair Network" : index === 2 ? "Replacement Car" : index === 3 ? "Quality Guaranteed" : "Fast Turnaround",
        },
      ]),
      // ── WHAT WE DO SECTION ────────────────────────────────────
      {
        key: "valueKicker",
        type: "text",
        label: "What We Do – Eyebrow Text",
        required: false,
        placeholder: "What We Do",
      },
      {
        key: "valueTitle",
        type: "text",
        label: "What We Do – Heading",
        required: true,
        placeholder:
          "We offer service, speed, quality and value for all aspects of vehicle repair",
      },
      {
        key: "valueDescription",
        type: "text",
        label: "What We Do – Description",
        required: true,
        placeholder:
          "Whether you've had a minor scrape or a major collision, our approved repair network delivers expert repairs - with replacement vehicles arranged while yours is being fixed.",
      },
      // ── JOIN CTA SECTION ──────────────────────────────────────
      {
        key: "joinIcon",
        type: "image",
        label: "Join CTA – Icon Image",
        helpText: "Small icon displayed left of the CTA text (e.g. handshake).",
        required: false,
        multilingual: false,
      },
      {
        key: "joinTitle",
        type: "text",
        label: "Join CTA – Main Text",
        required: true,
        placeholder: "Want to join the network?",
      },
      {
        key: "joinSubtitle",
        type: "text",
        label: "Join CTA – Sub Text",
        required: true,
        placeholder: "Want to join the network as an approved repairer?",
      },
      {
        key: "joinButtonText",
        type: "text",
        label: "Join CTA – Button Label",
        required: true,
        placeholder: "Become a Partner",
      },
      {
        key: "joinButtonLink",
        type: "link",
        label: "Join CTA – Button Link",
        required: true,
        multilingual: false,
        placeholder: "/contact",
        selectPageForRedirect: true,
      },
    ],
    sampleContent: {
      heroKicker: { en: "Australia's Premier Accident Repair Network" },
      heroTitleLine1: { en: "Australia's Trusted" },
      heroTitleLine2: { en: "Accident Repair Network" },
      heroSubtitle: {
        en: "Providing the right solution first time, every time. From driveable repairs to full accident management - we handle it all.",
      },
      heroPrimaryButtonText: { en: "Book a Repair" },
      heroPrimaryButtonLink: "/book-a-repair",
      heroSecondaryButtonText: { en: "Find Your Nearest Repairer" },
      heroSecondaryButtonLink: "/find-a-repairer",
      trustBarTitle: { en: "Trusted by drivers across Victoria" },
      trustItem1Label: { en: "Authorised Repair Network" },
      trustItem2Label: { en: "Replacement Car" },
      trustItem3Label: { en: "Quality Guaranteed" },
      trustItem4Label: { en: "Fast Turnaround" },
      valueKicker: { en: "What We Do" },
      valueTitle: {
        en: "We offer service, speed, quality and value for all aspects of vehicle repair",
      },
      valueDescription: {
        en: "Whether you've had a minor scrape or a major collision, our approved repair network delivers expert repairs - with replacement vehicles arranged while yours is being fixed.",
      },
      joinTitle: { en: "Want to join the network?" },
      joinSubtitle: { en: "Want to join the network as an approved repairer?" },
      joinButtonText: { en: "Become a Partner" },
      joinButtonLink: "/contact",
    },
  },
  {
    key: "ABOUT_TEMPLATE_V1",
    name: "About Template",
    description:
      "Reference About page structure: hero, who we are section, and why choose us cards.",
    fields: [
      {
        key: "aboutHeroImage",
        type: "image",
        label: "Hero Image",
        required: false,
        multilingual: false,
      },
      {
        key: "aboutHeroEyebrow",
        type: "text",
        label: "Hero Eyebrow",
        required: true,
        placeholder: "About Us",
      },
      {
        key: "aboutHeroTitle",
        type: "text",
        label: "Hero Title",
        required: true,
        placeholder: "About Everyday Car Repair Network",
      },
      {
        key: "aboutHeroSubtitle",
        type: "text",
        label: "Hero Subtitle",
        required: true,
        placeholder: "Australia's premier accident repair network.",
      },
      {
        key: "aboutWhoTitle",
        type: "text",
        label: "Who We Are Section Title",
        required: true,
        placeholder: "Who We Are and What We Do",
      },
      {
        key: "aboutWhoImage",
        type: "image",
        label: "Who We Are Section Image",
        required: false,
        multilingual: false,
      },
      ...[1, 2, 3].flatMap((index) => [
        {
          key: `aboutWhoItem${index}Icon`,
          type: "image",
          label: `Who We Are Item ${index} Icon`,
          required: false,
          multilingual: false,
        },
        {
          key: `aboutWhoItem${index}Title`,
          type: "text",
          label: `Who We Are Item ${index} Title`,
          required: true,
          placeholder: `Feature ${index} title`,
        },
        {
          key: `aboutWhoItem${index}Text`,
          type: "text",
          label: `Who We Are Item ${index} Description`,
          required: true,
          placeholder: `Feature ${index} description`,
        },
      ]),
      {
        key: "aboutWhyTitle",
        type: "text",
        label: "Why Choose Us Section Title",
        required: true,
        placeholder: "Why Choose Us",
      },
      ...[1, 2, 3, 4].flatMap((index) => [
        {
          key: `aboutWhyCard${index}Icon`,
          type: "image",
          label: `Why Choose Card ${index} Icon`,
          required: false,
          multilingual: false,
        },
        {
          key: `aboutWhyCard${index}Title`,
          type: "text",
          label: `Why Choose Card ${index} Title`,
          required: true,
          placeholder: `Card ${index} title`,
        },
        {
          key: `aboutWhyCard${index}Text`,
          type: "text",
          label: `Why Choose Card ${index} Description`,
          required: true,
          placeholder: `Card ${index} description`,
        },
      ]),
    ],
    sampleContent: {
      aboutHeroEyebrow: { en: "About Us" },
      aboutHeroTitle: { en: "About Everyday Car Repair Network" },
      aboutHeroSubtitle: { en: "Australia's premier accident repair network." },
      aboutWhoTitle: { en: "Who We Are and What We Do" },
      aboutWhoItem1Title: { en: "Reliable repair services" },
      aboutWhoItem1Text: {
        en: "Everyday Car Repair Network connects drivers with high-quality approved repairers, towing services and replacement vehicles - handling the entire process from first contact to vehicle collection.",
      },
      aboutWhoItem2Title: { en: "Trusted repair partners" },
      aboutWhoItem2Text: {
        en: "Our business isn't just about fixing cars - it's about caring for customers, getting their vehicles back on the road with the minimum amount of fuss and maximum amount of care.",
      },
      aboutWhoItem3Title: { en: "Smooth claim support" },
      aboutWhoItem3Text: {
        en: "Operating across Victoria, with national expansion underway, we manage vehicle repair referrals through our approved repairer network, providing a broad range of repair solutions to meet the evolving needs of the industry.",
      },
      aboutWhyTitle: { en: "Why Choose Us" },
      aboutWhyCard1Title: { en: "Authorised Repair Network" },
      aboutWhyCard1Text: {
        en: "We partner with trusted, qualified, and approved repairers.",
      },
      aboutWhyCard2Title: { en: "Insurance Partner Approved" },
      aboutWhyCard2Text: {
        en: "Approved by leading insurers across Australia.",
      },
      aboutWhyCard3Title: { en: "Nationwide Coverage" },
      aboutWhyCard3Text: {
        en: "A strong network across major states and growing.",
      },
      aboutWhyCard4Title: { en: "24/7 Support" },
      aboutWhyCard4Text: {
        en: "Our support team is available whenever you need us.",
      },
    },
  },
  {
    key: "SERVICES_TEMPLATE_V1",
    name: "Services Template",
    description:
      "Reference Services page structure: hero, service list cards, and CTA.",
    fields: [
      { key: "servicesHeroImage", type: "image", label: "Hero Image", multilingual: false },
      { key: "servicesHeroEyebrow", type: "text", label: "Hero Eyebrow", required: true, placeholder: "Services" },
      { key: "servicesHeroTitle", type: "text", label: "Hero Title", required: true, placeholder: "Our Services" },
      { key: "servicesHeroSubtitle", type: "text", label: "Hero Subtitle", required: true, placeholder: "Comprehensive accident repair solutions..." },
      ...[1, 2, 3].flatMap((index) => ([
        { key: `servicesCard${index}Number`, type: "text", label: `Service Card ${index} Number`, required: true, placeholder: `0${index}` },
        { key: `servicesCard${index}Title`, type: "text", label: `Service Card ${index} Title`, required: true },
        { key: `servicesCard${index}Description`, type: "text", label: `Service Card ${index} Description`, required: true },
        { key: `servicesCard${index}Image`, type: "image", label: `Service Card ${index} Image`, multilingual: false },
        { key: `servicesCard${index}Bullet1`, type: "text", label: `Service Card ${index} Bullet 1`, required: false },
        { key: `servicesCard${index}Bullet2`, type: "text", label: `Service Card ${index} Bullet 2`, required: false },
        { key: `servicesCard${index}Bullet3`, type: "text", label: `Service Card ${index} Bullet 3`, required: false },
        { key: `servicesCard${index}Bullet4`, type: "text", label: `Service Card ${index} Bullet 4`, required: false },
      ])),
      { key: "servicesCtaTitle", type: "text", label: "CTA Title", required: true, placeholder: "Ready to join the network?" },
      { key: "servicesCtaButtonText", type: "text", label: "CTA Button Text", required: true, placeholder: "Book a Repair" },
      { key: "servicesCtaButtonLink", type: "link", label: "CTA Button Link", required: true, multilingual: false, placeholder: "/repair-booking", selectPageForRedirect: true },
    ],
    sampleContent: {
      servicesHeroEyebrow: { en: "Services" },
      servicesHeroTitle: { en: "Our Services" },
      servicesHeroSubtitle: {
        en: "Comprehensive accident repair solutions - from driveable minor damage through to full accident management and recovery.",
      },
      servicesCard1Number: { en: "01" },
      servicesCard1Title: { en: "Driveable Repair Solution" },
      servicesCard1Description: {
        en: "For vehicles that can still be driven after an accident. We arrange fast, quality repair and relief transport so you're back on the road within 1-3 days.",
      },
      servicesCard1Bullet1: { en: "Fast appointment scheduling" },
      servicesCard1Bullet2: { en: "Hire car / transport arranged" },
      servicesCard1Bullet3: { en: "Replacement vehicle managed" },
      servicesCard2Number: { en: "02" },
      servicesCard2Title: { en: "Non-Driveable Repair Solution" },
      servicesCard2Description: {
        en: "For vehicles that cannot be driven following an accident. We arrange towing, full damage assessment and a replacement vehicle while yours is repaired.",
      },
      servicesCard2Bullet1: { en: "Immediate tow truck dispatch" },
      servicesCard2Bullet2: { en: "Hire vehicle arranged" },
      servicesCard2Bullet3: { en: "Full structural repair capability" },
      servicesCard2Bullet4: { en: "Real-time status updates" },
      servicesCard3Number: { en: "03" },
      servicesCard3Title: { en: "Accident Management" },
      servicesCard3Description: {
        en: "Complete end-to-end accident management for drivers. We manage your entire incident from the moment you call.",
      },
      servicesCard3Bullet1: { en: "24/7 inbound call centre" },
      servicesCard3Bullet2: { en: "Liability assessment" },
      servicesCard3Bullet3: { en: "Insurer recovery management" },
      servicesCard3Bullet4: { en: "Settlement coordination" },
      servicesCtaTitle: { en: "Ready to join the network?" },
      servicesCtaButtonText: { en: "Book a Repair" },
      servicesCtaButtonLink: "/repair-booking",
    },
  },
  {
    key: "LEGAL_PAGE_TEMPLATE_V1",
    name: "Legal Page Template",
    description:
      "Shared layout for Privacy Policy and Terms & Conditions: hero and one full-page description (CKEditor).",
    fields: [
      { key: "legalHeroImage", type: "image", label: "Hero Image", multilingual: false },
      { key: "legalHeroEyebrow", type: "text", label: "Hero Eyebrow", required: true, placeholder: "Legal" },
      { key: "legalHeroTitle", type: "text", label: "Hero Title", required: true, placeholder: "Privacy Policy" },
      { key: "legalHeroDescription", type: "text", label: "Hero Description", required: true, placeholder: "Your privacy and trust are important to us." },
      {
        key: "legalDescription",
        type: "richText",
        label: "Page Description",
        required: true,
        placeholder: "Add the full legal page content...",
        helpText: "Use headings, lists, links, tables, and images for the full legal page body.",
      },
    ],
    sampleContent: {
      legalHeroEyebrow: { en: "Legal" },
      legalHeroTitle: { en: "Privacy Policy" },
      legalHeroDescription: {
        en: "Your privacy and trust are important to us.",
      },
      legalDescription: {
        en: "<p><strong>Effective Date: 3 March 2026 (AEST)</strong></p><h2>1. Acceptance of These Terms</h2><p>These Terms and Conditions govern your use of the Everyday Car Repair Network website and services.</p><h2>2. Our Services</h2><p>Everyday Car Repair Network connects customers with approved repairers and assists with repair enquiries, quotations, booking management, and accident repair services.</p>",
      },
    },
  },
  {
    key: "NETWORK_TEMPLATE_V1",
    name: "Network Template",
    description:
      "Reference Network page structure: hero, search bar, grouped locations, stats, and join CTA.",
    fields: [
      { key: "networkHeroImage", type: "image", label: "Hero Image", multilingual: false },
      { key: "networkHeroEyebrow", type: "text", label: "Hero Eyebrow", required: true, placeholder: "Our Network" },
      { key: "networkHeroTitleLine1", type: "text", label: "Hero Title Line 1", required: true, placeholder: "Find Your Nearest" },
      { key: "networkHeroTitleLine2", type: "text", label: "Hero Title Line 2", required: true, placeholder: "Approved Repairer" },
      { key: "networkHeroSubtitle", type: "text", label: "Hero Subtitle", required: true },
      { key: "networkStat1Number", type: "text", label: "Stat 1 Number", required: true, placeholder: "21+" },
      { key: "networkStat1Label", type: "text", label: "Stat 1 Label", required: true, placeholder: "Locations Nationwide" },
      { key: "networkStat2Number", type: "text", label: "Stat 2 Number", required: true, placeholder: "111" },
      { key: "networkStat2Label", type: "text", label: "Stat 2 Label", required: true, placeholder: "Vic Panel Contractors" },
      { key: "networkStat3Number", type: "text", label: "Stat 3 Number", required: true, placeholder: "1300 721 840" },
      { key: "networkStat3Label", type: "text", label: "Stat 3 Label", required: true, placeholder: "Call Us Today" },
      { key: "networkJoinTitle", type: "text", label: "Join CTA Title", required: true, placeholder: "Are you a repairer? Join our network." },
      { key: "networkJoinDescription", type: "text", label: "Join CTA Description", required: true },
      { key: "networkJoinButtonText", type: "text", label: "Join CTA Button Text", required: true, placeholder: "Become a Partner" },
      { key: "networkJoinButtonLink", type: "link", label: "Join CTA Button Link", required: true, multilingual: false, placeholder: "/contact", selectPageForRedirect: true },
    ],
    sampleContent: {
      networkHeroEyebrow: { en: "Our Network" },
      networkHeroTitleLine1: { en: "Find Your Nearest" },
      networkHeroTitleLine2: { en: "Approved Repairer" },
      networkHeroSubtitle: {
        en: "Our approved network of repairers is ready across Australia. Find your nearest repairer and book your repair today.",
      },
      networkStat1Number: { en: "21+" },
      networkStat1Label: { en: "Locations Nationwide" },
      networkStat2Number: { en: "111" },
      networkStat2Label: { en: "Vic Panel Contractors" },
      networkStat3Number: { en: "1300 721 840" },
      networkStat3Label: { en: "Call Us Today" },
      networkJoinTitle: { en: "Are you a repairer? Join our network." },
      networkJoinDescription: {
        en: "We're actively recruiting approved repairers across Victoria. If you operate a licensed repair facility and want a steady stream of referred work, we'd like to hear from you.",
      },
      networkJoinButtonText: { en: "Become a Partner" },
      networkJoinButtonLink: "/contact",
    },
  },
  {
    key: "CONTACT_TEMPLATE_V1",
    name: "Contact Template",
    description:
      "Reference Contact page structure: hero, contact info card, contact form, and map/office section.",
    fields: [
      { key: "contactHeroImage", type: "image", label: "Hero Image", multilingual: false },
      { key: "contactHeroEyebrow", type: "text", label: "Hero Eyebrow", required: true, placeholder: "Contact Us" },
      { key: "contactHeroTitle", type: "text", label: "Hero Title", required: true, placeholder: "Get in Touch" },
      { key: "contactHeroSubtitle", type: "text", label: "Hero Subtitle", required: true },
      { key: "contactInfoPhone", type: "text", label: "Info Card Phone Number", required: true, placeholder: "1300 721 840" },
      { key: "contactInfoPhoneLabel", type: "text", label: "Info Card Phone Label", required: true, placeholder: "Primary Inbound Number" },
      { key: "contactInfoEmail", type: "text", label: "Info Card Email", required: true, placeholder: "info@everydaycarrepair.com.au" },
      { key: "contactInfoAddress", type: "text", label: "Info Card Address", required: true, placeholder: "1341 Dandenong Rd, Chadstone VIC 3148" },
      { key: "contactInfoHoursLine1", type: "text", label: "Opening Hours Line 1", required: true, placeholder: "Monday - Friday 8:00am - 6:00pm" },
      { key: "contactInfoHoursLine2", type: "text", label: "Opening Hours Line 2", required: true, placeholder: "Saturday 9:00am - 1:00pm" },
      { key: "contactFormTitle", type: "text", label: "Form Title", required: true, placeholder: "Send us a message" },
      { key: "contactFormSubmitText", type: "text", label: "Form Submit Button Text", required: true, placeholder: "Send Message ->" },
      { key: "contactMapOfficeLabel", type: "text", label: "Map Office Label", required: true, placeholder: "Everyday Car Repair Network HQ" },
    ],
    sampleContent: {
      contactHeroEyebrow: { en: "Contact Us" },
      contactHeroTitle: { en: "Get in Touch" },
      contactHeroSubtitle: {
        en: "Need accident repair support or want to join our network? Send us a message and our team will get back to you.",
      },
      contactInfoPhone: { en: "1300 721 840" },
      contactInfoPhoneLabel: { en: "Primary Inbound Number" },
      contactInfoEmail: { en: "info@everydaycarrepair.com.au" },
      contactInfoAddress: { en: "1341 Dandenong Rd, Chadstone VIC 3148" },
      contactInfoHoursLine1: { en: "Monday - Friday 8:00am - 6:00pm" },
      contactInfoHoursLine2: { en: "Saturday 9:00am - 1:00pm" },
      contactFormTitle: { en: "Send us a message" },
      contactFormSubmitText: { en: "Send Message ->" },
      contactMapOfficeLabel: { en: "Everyday Car Repair Network HQ" },
    },
  },
  {
    key: "BOOK_REPAIR_TEMPLATE_V1",
    name: "Book Repair Template",
    description:
      "Reference Book a Repair page structure: hero, benefit chips, booking progress labels, sidebar benefits, and form action text.",
    fields: [
      {
        key: "bookRepairHeroImage",
        type: "image",
        label: "Hero Image",
        required: false,
        multilingual: false,
      },
      {
        key: "bookRepairHeroEyebrow",
        type: "text",
        label: "Hero Eyebrow",
        required: true,
        placeholder: "Book a Repair",
      },
      {
        key: "bookRepairHeroTitleLine1",
        type: "text",
        label: "Hero Title Line 1",
        required: true,
        placeholder: "Been in an Accident? We'll",
      },
      {
        key: "bookRepairHeroTitleLine2",
        type: "text",
        label: "Hero Title Line 2",
        required: true,
        placeholder: "Handle the Rest.",
      },
      {
        key: "bookRepairHeroSubtitle",
        type: "text",
        label: "Hero Subtitle",
        required: true,
        placeholder:
          "Fill in your details below and one of our team will contact you within the hour to arrange your repair and replacement vehicle.",
      },
      {
        key: "bookRepairBenefit1",
        type: "text",
        label: "Hero Benefit 1",
        required: true,
        placeholder: "Free service - no cost to you",
      },
      {
        key: "bookRepairBenefit2",
        type: "text",
        label: "Hero Benefit 2",
        required: true,
        placeholder: "Replacement vehicle arranged",
      },
      {
        key: "bookRepairBenefit3",
        type: "text",
        label: "Hero Benefit 3",
        required: true,
        placeholder: "We handle everything",
      },
      {
        key: "bookRepairBenefit4",
        type: "text",
        label: "Hero Benefit 4",
        required: true,
        placeholder: "Fast callback",
      },
      {
        key: "bookRepairWhyUseTitle",
        type: "text",
        label: "Sidebar Title",
        required: true,
        placeholder: "Why use EverydayCar?",
      },
      {
        key: "bookRepairWhyUseBenefit1",
        type: "text",
        label: "Sidebar Benefit 1",
        required: true,
        placeholder: "Free service - no cost to you",
      },
      {
        key: "bookRepairWhyUseBenefit2",
        type: "text",
        label: "Sidebar Benefit 2",
        required: true,
        placeholder: "We arrange a replacement vehicle",
      },
      {
        key: "bookRepairWhyUseBenefit3",
        type: "text",
        label: "Sidebar Benefit 3",
        required: true,
        placeholder: "Approved repairers only",
      },
      {
        key: "bookRepairWhyUseBenefit4",
        type: "text",
        label: "Sidebar Benefit 4",
        required: true,
        placeholder: "Fast callback",
      },
      {
        key: "bookRepairWhyUseBenefit5",
        type: "text",
        label: "Sidebar Benefit 5",
        required: true,
        placeholder: "We manage the process end to end",
      },
      {
        key: "bookRepairPreferCallText",
        type: "text",
        label: "Sidebar Call Label",
        required: true,
        placeholder: "Prefer to call?",
      },
      {
        key: "bookRepairPhoneNumber",
        type: "text",
        label: "Sidebar Phone Number",
        required: true,
        placeholder: "1300 721 840",
      },
      {
        key: "bookRepairCallButtonText",
        type: "text",
        label: "Sidebar Call Button Text",
        required: true,
        placeholder: "Call Now",
      },
    ],
  },
  {
    key: "FIND_A_REPAIRER_TEMPLATE_V1",
    name: "Find a Repairer Template",
    description:
      "Reference Find a Repairer page structure: hero, search panel, results heading, and support CTA.",
    fields: [
      {
        key: "findRepairerHeroImage",
        type: "image",
        label: "Hero Image",
        required: false,
        multilingual: false,
      },
      {
        key: "findRepairerHeroEyebrow",
        type: "text",
        label: "Hero Eyebrow",
        required: true,
        placeholder: "Find a Repairer",
      },
      {
        key: "findRepairerHeroTitleLine1",
        type: "text",
        label: "Hero Title Line 1",
        required: true,
        placeholder: "Find an Approved Repairer",
      },
      {
        key: "findRepairerHeroTitleLine2",
        type: "text",
        label: "Hero Title Line 2",
        required: true,
        placeholder: "Near You",
      },
      {
        key: "findRepairerHeroSubtitle",
        type: "text",
        label: "Hero Subtitle",
        required: true,
        placeholder:
          "Enter your suburb or postcode to find the closest approved repairer in the EverydayCar Repair Network.",
      },
      {
        key: "findRepairerSearchPlaceholder",
        type: "text",
        label: "Search Placeholder",
        required: true,
        placeholder: "Enter suburb or postcode",
      },
      {
        key: "findRepairerSearchButtonText",
        type: "text",
        label: "Search Button Text",
        required: true,
        placeholder: "Find Repairers",
      },
      {
        key: "findRepairerResultsTitle",
        type: "text",
        label: "Results Section Title",
        required: true,
        placeholder: "Nearby approved repairers",
      },
      {
        key: "findRepairerCtaTitle",
        type: "text",
        label: "Bottom CTA Title",
        required: true,
        placeholder: "Can't find a repairer near you?",
      },
      {
        key: "findRepairerCtaDescription",
        type: "text",
        label: "Bottom CTA Description",
        required: true,
        placeholder:
          "Our network is expanding. In the meantime, call us on 1300 721 840 - our team will arrange the right repairer for your location.",
      },
      {
        key: "findRepairerPhoneNumber",
        type: "text",
        label: "Bottom CTA Phone Number",
        required: true,
        placeholder: "1300 721 840",
      },
      {
        key: "findRepairerCallButtonText",
        type: "text",
        label: "Bottom CTA Call Button Text",
        required: true,
        placeholder: "Call 1300 721 840",
      },
      {
        key: "findRepairerBookButtonText",
        type: "text",
        label: "Bottom CTA Book Button Text",
        required: true,
        placeholder: "Book a Repair Online",
      },
      {
        key: "findRepairerBookButtonLink",
        type: "link",
        label: "Bottom CTA Book Button Link",
        required: true,
        multilingual: false,
        placeholder: "/repair-booking",
        selectPageForRedirect: true,
      },
    ],
    sampleContent: {
      findRepairerHeroEyebrow: { en: "Find a Repairer" },
      findRepairerHeroTitleLine1: { en: "Find an Approved Repairer" },
      findRepairerHeroTitleLine2: { en: "Near You" },
      findRepairerHeroSubtitle: {
        en: "Enter your suburb or postcode to find the closest approved repairer in the EverydayCar Repair Network.",
      },
      findRepairerSearchPlaceholder: { en: "Enter suburb or postcode" },
      findRepairerSearchButtonText: { en: "Find Repairers" },
      findRepairerResultsTitle: { en: "Nearby approved repairers" },
      findRepairerCtaTitle: { en: "Can't find a repairer near you?" },
      findRepairerCtaDescription: {
        en: "Our network is expanding. In the meantime, call us on 1300 721 840 - our team will arrange the right repairer for your location.",
      },
      findRepairerPhoneNumber: { en: "1300 721 840" },
      findRepairerCallButtonText: { en: "Call 1300 721 840" },
      findRepairerBookButtonText: { en: "Book a Repair Online" },
      findRepairerBookButtonLink: "/repair-booking",
    },
  },
  {
    key: "FOOTER_TEMPLATE_V1",
    name: "Footer Template",
    description:
      "Footer structured content: tagline, address, phone, social links, and copyright.",
    fields: [
      {
        key: "footerTagline",
        type: "text",
        label: "Footer Tagline",
        required: true,
        placeholder:
          "Australia's trusted accident repair network - connecting drivers with quality approved repairers.",
      },
      {
        key: "footerAddress",
        type: "text",
        label: "Footer Address",
        required: false,
        placeholder: "Suite 2, 86 High Street, Berwick Victoria 3806",
      },
      {
        key: "footerPhone",
        type: "text",
        label: "Footer Phone",
        required: true,
        multilingual: false,
        placeholder: "1300721840",
      },
      {
        key: "footerGetInTouchTitle",
        type: "text",
        label: "Get In Touch Title",
        required: true,
        placeholder: "Get In Touch",
      },
      {
        key: "footerCopyright",
        type: "text",
        label: "Footer Copyright Text",
        required: false,
        placeholder:
          "(c) 2026 Everyday Car Repair Network Pty Ltd | everydaycar.com.au | ABN 68 634 541 058",
      },
    ],
    sampleContent: {
      footerTagline: {
        en: "Australia's trusted accident repair network - connecting drivers with quality approved repairers.",
      },
      footerAddress: {
        en: "Suite 2, 86 High Street, Berwick Victoria 3806",
      },
      footerPhone: "1300721840",
      footerGetInTouchTitle: { en: "Get In Touch" },
      footerCopyright: {
        en: "(c) 2026 Everyday Car Repair Network Pty Ltd | everydaycar.com.au | ABN 68 634 541 058",
      },
    },
  },
  {
    key: "HOMEPAGE_V1",
    name: "Home Page",
    description: "Template for the main homepage with banner, sections, and call-to-action",
    fields: [
      // Banner Section
      {
        key: "bannerTitle",
        type: "text",
        label: "Banner Title",
        required: true,
        placeholder: "Flexible School Fee Support. Structured for Certainty.",
      },
      {
        key: "bannerDescription",
        type: "richText",
        label: "Banner Description",
        required: true,
        placeholder: "Termly provides schools with a clear and structured way...",
      },
      {
        key: "bannerButton1Text",
        type: "text",
        label: "Banner Button 1 Text",
        placeholder: "For Schools",
      },
      {
        key: "bannerButton1Link",
        type: "link",
        label: "Banner Button 1 Link",
        placeholder: "enquire",
      },
      {
        key: "bannerButton2Text",
        type: "text",
        label: "Banner Button 2 Text",
        placeholder: "For Parents",
      },
      {
        key: "bannerButton2Link",
        type: "link",
        label: "Banner Button 2 Link",
        placeholder: "contact",
      },
      {
        key: "bannerImage",
        type: "image",
        label: "Banner Image/Shape",
        placeholder: "shape.svg",
      },
      
      // Section 1 - The Need
      {
        key: "section1Title",
        type: "text",
        label: "Section 1 Title",
        required: true,
        placeholder: "Balancing Flexibility with Stability",
      },
      {
        key: "section1Description",
        type: "richText",
        label: "Section 1 Description",
        required: true,
        placeholder: "Schools increasingly require solutions...",
      },
      {
        key: "section1Image",
        type: "image",
        label: "Section 1 Image",
        placeholder: "balancing_flexibility_with_stability.png",
      },
      
      // Section 2 - What Termly Is
      {
        key: "section2Title",
        type: "text",
        label: "Section 2 Title",
        required: true,
        placeholder: "A Structured Payment Support Platform",
      },
      {
        key: "section2Description",
        type: "richText",
        label: "Section 2 Description",
        required: true,
        placeholder: "Termly enables schools to offer structured...",
      },
      {
        key: "section2Image",
        type: "image",
        label: "Section 2 Image",
        placeholder: "structured_payment_support_platform.png",
      },
      {
        key: "section2Feature1",
        type: "text",
        label: "Section 2 Feature 1",
        placeholder: "Simple onboarding",
      },
      {
        key: "section2Feature2",
        type: "text",
        label: "Section 2 Feature 2",
        placeholder: "Clear communication framework",
      },
      {
        key: "section2Feature3",
        type: "text",
        label: "Section 2 Feature 3",
        placeholder: "Structured term-based plans",
      },
      {
        key: "section2Feature4",
        type: "text",
        label: "Section 2 Feature 4",
        placeholder: "Ongoing support throughout each cycle",
      },
      
      // Section 3 - How It Works (Homepage Version)
      {
        key: "section3Title",
        type: "text",
        label: "Section 3 Title",
        required: true,
        placeholder: "A Clear and Measured Process",
      },
      {
        key: "section3Step1",
        type: "text",
        label: "Section 3 Step 1",
        placeholder: "School Registration",
      },
      {
        key: "section3Step1Description",
        type: "richText",
        label: "Section 3 Step 1 Description",
        placeholder: "Schools complete a short registration form...",
      },
      {
        key: "section3Step2",
        type: "text",
        label: "Section 3 Step 2",
        placeholder: "Review & Structuring",
      },
      {
        key: "section3Step2Description",
        type: "richText",
        label: "Section 3 Step 2 Description",
        placeholder: "We assess suitability and align...",
      },
      {
        key: "section3Step3",
        type: "text",
        label: "Section 3 Step 3",
        placeholder: "Implementation",
      },
      {
        key: "section3Step3Description",
        type: "richText",
        label: "Section 3 Step 3 Description",
        placeholder: "Families are onboarded through...",
      },
      {
        key: "section3Step4",
        type: "text",
        label: "Section 3 Step 4",
        placeholder: "Ongoing Support",
      },
      {
        key: "section3Step4Description",
        type: "richText",
        label: "Section 3 Step 4 Description",
        placeholder: "Our team provides assistance...",
      },
      {
        key: "section3Image",
        type: "image",
        label: "Section 3 Image",
        placeholder: "structured_payment_support_platform.png",
      },
      
      // Section 4 - Designed for Schools
      {
        key: "section4Title",
        type: "text",
        label: "Section 4 Title",
        required: true,
        placeholder: "Built Around Your Operations",
      },
      {
        key: "section4Description",
        type: "richText",
        label: "Section 4 Description",
        required: true,
        placeholder: "Termly integrates alongside existing school processes...",
      },
      {
        key: "section4Image",
        type: "image",
        label: "Section 4 Image",
        placeholder: "built_around_your_operations.png",
      },
      {
        key: "section4Feature1",
        type: "text",
        label: "Section 4 Feature 1",
        placeholder: "Aligned to school fee calendars",
      },
      {
        key: "section4Feature2",
        type: "text",
        label: "Section 4 Feature 2",
        placeholder: "Transparent structure",
      },
      {
        key: "section4Feature3",
        type: "text",
        label: "Section 4 Feature 3",
        placeholder: "Professional communication materials",
      },
      {
        key: "section4Feature4",
        type: "text",
        label: "Section 4 Feature 4",
        placeholder: "Dedicated support during onboarding",
      },
      
      // Section 5 - Positioning
      {
        key: "section5Title",
        type: "text",
        label: "Section 5 Title",
        required: true,
        placeholder: "Professional Structured Discreet",
      },
      {
        key: "section5Description",
        type: "richText",
        label: "Section 5 Description",
        required: true,
        placeholder: "Termly works collaboratively with schools...",
      },
      {
        key: "section5Image",
        type: "image",
        label: "Section 5 Image",
        placeholder: "professional_structured_discreet.png",
      },
      
      // Final CTA Section
      {
        key: "ctaTitle",
        type: "text",
        label: "CTA Section Title",
        required: true,
        placeholder: "Explore a Structured Approach to Fee Flexibility.",
      },
      {
        key: "ctaButton1Text",
        type: "text",
        label: "CTA Button 1 Text",
        placeholder: "Register Your School",
      },
      {
        key: "ctaButton2Text",
        type: "text",
        label: "CTA Button 2 Text",
        placeholder: "Contact Our Team",
      },
      {
        key: "ctaImage",
        type: "image",
        label: "CTA Section Image",
        placeholder: "built_around_your_operations.png",
      },
      
      // Termly Difference Section
      {
        key: "differenceTitle",
        type: "text",
        label: "Difference Section Title",
        required: true,
        placeholder: "Discover the Termly difference",
      },
      {
        key: "differenceDescription",
        type: "text",
        label: "Difference Section Description",
        placeholder: "Offer families flexibility and Improve payment confidence.",
      },
      {
        key: "differenceCard1Title",
        type: "text",
        label: "Difference Card 1 Title",
        placeholder: "Flexible Payments for Families",
      },
      {
        key: "differenceCard1Description",
        type: "text",
        label: "Difference Card 1 Description",
        placeholder: "Termly allows families to split school fees...",
      },
      {
        key: "differenceCard1Image",
        type: "image",
        label: "Difference Card 1 Image",
        placeholder: "school.webp",
      },
      {
        key: "differenceCard2Title",
        type: "text",
        label: "Difference Card 2 Title",
        placeholder: "Stable Cash Flow for Schools",
      },
      {
        key: "differenceCard2Description",
        type: "text",
        label: "Difference Card 2 Description",
        placeholder: "Schools receive payments smoothly...",
      },
      {
        key: "differenceCard2Image",
        type: "image",
        label: "Difference Card 2 Image",
        placeholder: "family.webp",
      },
    ],
    sampleContent: {
      bannerTitle: { en: "Flexible School Fee Support. Structured for Certainty." },
      bannerDescription: { 
        en: "<p>Termly provides schools with a clear and structured way to offer families term-based fee flexibility — without increasing administrative burden.</p>" 
      },
      bannerButton1Text: { en: "For Schools" },
      bannerButton1Link: { en: "enquire" },
      bannerButton2Text: { en: "For Parents" },
      bannerButton2Link: { en: "contact" },
      section1Title: { en: "Balancing Flexibility with Stability" },
      section1Description: { 
        en: "<p>Schools increasingly require solutions that support families while maintaining predictable fee collection and operational clarity.</p><p>Termly is designed to help schools provide structured payment flexibility without disrupting core systems or processes.</p>" 
      },
      section2Title: { en: "A Structured Payment Support Platform" },
      section2Description: { 
        en: "<p>Termly enables schools to offer structured, term-based fee support through a secure and streamlined process.</p><p>The platform is designed around existing school fee calendars and administrative workflows.</p>" 
      },
      section2Feature1: { en: "Simple onboarding" },
      section2Feature2: { en: "Clear communication framework" },
      section2Feature3: { en: "Structured term-based plans" },
      section2Feature4: { en: "Ongoing support throughout each cycle" },
      section3Title: { en: "A Clear and Measured Process" },
      section3Step1: { en: "School Registration" },
      section3Step1Description: { 
        en: "<p>Schools complete a short registration form to begin the process.</p>" 
      },
      section3Step2: { en: "Review & Structuring" },
      section3Step2Description: { 
        en: "<p>We assess suitability and align a term-based structure to your existing fee schedule.</p>" 
      },
      section3Step3: { en: "Implementation" },
      section3Step3Description: { 
        en: "<p>Families are onboarded through a secure and structured digital process.</p>" 
      },
      section3Step4: { en: "Ongoing Support" },
      section3Step4Description: { 
        en: "<p>Our team provides assistance and oversight throughout the term.</p>" 
      },
      section4Title: { en: "Built Around Your Operations" },
      section4Description: { 
        en: "<p>Termly integrates alongside existing school processes.</p><p>It is designed to reduce friction, support engagement and provide structured clarity — without adding unnecessary administrative complexity.</p>" 
      },
      section4Feature1: { en: "Aligned to school fee calendars" },
      section4Feature2: { en: "Transparent structure" },
      section4Feature3: { en: "Professional communication materials" },
      section4Feature4: { en: "Dedicated support during onboarding" },
      section5Title: { en: "Professional Structured Discreet" },
      section5Description: { 
        en: "<p>Termly works collaboratively with schools to introduce measured fee flexibility within a controlled and transparent framework.</p><p>Our focus is long-term alignment and operational clarity.</p>" 
      },
      ctaTitle: { en: "Explore a Structured Approach to Fee Flexibility." },
      ctaButton1Text: { en: "Register Your School" },
      ctaButton2Text: { en: "Contact Our Team" },
      differenceTitle: { en: "Discover the Termly difference" },
      differenceDescription: { en: "Offer families flexibility and Improve payment confidence." },
      differenceCard1Title: { en: "Flexible Payments for Families" },
      differenceCard1Description: { en: "Termly allows families to split school fees into manageable instalment" },
      differenceCard2Title: { en: "Stable Cash Flow for Schools" },
      differenceCard2Description: { en: "Schools receive payments smoothly while offering families greater flexibility." },
      // Sample images for homepage template
      bannerImage: "/assets/img/new/shape.svg",
      section1Image: "/assets/img/termly/balancing_flexibility_with_stability.png",
      section2Image: "/assets/img/termly/structured_payment_support_platform.png",
      section3Image: "/assets/img/termly/structured_payment_support_platform.png",
      section4Image: "/assets/img/termly/built_around_your_operations.png",
      section5Image: "/assets/img/new/professional_structured_discreet.png",
      ctaImage: "/assets/img/termly/built_around_your_operations.png",
      differenceCard1Image: "/assets/img/new/school.webp",
      differenceCard2Image: "/assets/img/new/family.webp",
    },
  },
];

// Additional templates that don't use SimpleTemplateEditor but should appear in dropdown
// These are handled by custom form logic (Contact Us, FAQ, Terms & Conditions)
export const ADDITIONAL_TEMPLATES: Array<{ value: string; label: string }> = [
  {
    value: "contact-us",
    label: "Contact Us",
  },
  {
    value: "faq",
    label: "FAQ",
  },
  {
    value: "terms-condition",
    label: "Terms & Conditions",
  },
  {
    value: "footer-template",
    label: "Footer Template",
  },
  {
    value: "privacy-policy",
    label: "Privacy Policy",
  },
  {
    value: "register-school",
    label: "Register Your School",
  },
];

// Helper: built-in static template keys (PAGE_TEMPLATE_V1) may be stored as
// `page_template` or `portfolio_template` in the DB; map to the shared definition.
const PAGE_TEMPLATE_BUILT_IN_KEY = "PAGE_TEMPLATE_V1";
const INNER_PAGE_TEMPLATE_BUILT_IN_KEY = "INNER_PAGE_V1";
const HOME_TEMPLATE_BUILT_IN_KEY = "HOME_TEMPLATE_V1";

// Helper function to get template by key
export const getTemplateByKey = (key: string): PageTemplate | undefined => {
  if (key === "about_template" || key === "ABOUT_TEMPLATE_V1") {
    return PAGE_TEMPLATES.find((t) => t.key === "ABOUT_TEMPLATE_V1");
  }
  if (key === "services_template" || key === "SERVICES_TEMPLATE_V1") {
    return PAGE_TEMPLATES.find((t) => t.key === "SERVICES_TEMPLATE_V1");
  }
  if (key === "legal_page_template" || key === "LEGAL_PAGE_TEMPLATE_V1") {
    return PAGE_TEMPLATES.find((t) => t.key === "LEGAL_PAGE_TEMPLATE_V1");
  }
  if (
    key === "network_template" ||
    key === "our_network_template" ||
    key === "NETWORK_TEMPLATE_V1"
  ) {
    return PAGE_TEMPLATES.find((t) => t.key === "NETWORK_TEMPLATE_V1");
  }
  if (
    key === "contact_template" ||
    key === "contactus_template" ||
    key === "CONTACT_TEMPLATE_V1"
  ) {
    return PAGE_TEMPLATES.find((t) => t.key === "CONTACT_TEMPLATE_V1");
  }
  if (key === "footer_template" || key === "FOOTER_TEMPLATE_V1") {
    return PAGE_TEMPLATES.find((t) => t.key === "FOOTER_TEMPLATE_V1");
  }
  if (
    key === "repair_booking_template" ||
    key === "book_repair_template"
  ) {
    return PAGE_TEMPLATES.find((t) => t.key === "BOOK_REPAIR_TEMPLATE_V1");
  }
  if (
    key === "find_a_repairer_template" ||
    key === "FIND_A_REPAIRER_TEMPLATE_V1"
  ) {
    return PAGE_TEMPLATES.find((t) => t.key === "FIND_A_REPAIRER_TEMPLATE_V1");
  }
  if (
    key === "page_template" ||
    key === "portfolio_template" ||
    key === PAGE_TEMPLATE_BUILT_IN_KEY
  ) {
    return PAGE_TEMPLATES.find((t) => t.key === PAGE_TEMPLATE_BUILT_IN_KEY);
  }
  if (key === "innerpage_template" || key === INNER_PAGE_TEMPLATE_BUILT_IN_KEY) {
    return PAGE_TEMPLATES.find((t) => t.key === INNER_PAGE_TEMPLATE_BUILT_IN_KEY);
  }
  if (key === "home_template" || key === "HOMEPAGE_V1" || key === HOME_TEMPLATE_BUILT_IN_KEY) {
    return PAGE_TEMPLATES.find((t) => t.key === HOME_TEMPLATE_BUILT_IN_KEY);
  }
  return PAGE_TEMPLATES.find((t) => t.key === key);
};

// Helper function to get all template keys and names
export const getTemplateOptions = (): Array<{ value: string; label: string }> => {
  // Combine PAGE_TEMPLATES with additional templates
  const templateOptions = PAGE_TEMPLATES.map((t) => ({
    value: t.key,
    label: t.name,
  }));
  
  // Add additional templates
  return [...templateOptions, ...ADDITIONAL_TEMPLATES];
};

export function getStaticPageTemplateOptions(): Array<{ value: string; label: string }> {
  return [...STATIC_PAGE_TEMPLATES];
}
