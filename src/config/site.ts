export const siteConfig = {
  name: "FlexStudio",
  tagline: "Premium Digital Marketplace",
  description:
    "High-quality web templates, UI kits, source code, SaaS boilerplates, and professional web development services.",
  url: "https://flexstudio.kauxync.in",
  email: "flexstudio@kauxync.in",
  supportEmail: "flexstudio@kauxync.in",
  mailerEmail: "mailer.flexstudio@kauxync.in",
  ogImage: "/images/og.png",

  currency: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
  },

  links: {
    twitter: "https://twitter.com/flexstudio",
    github: "https://github.com/kauxync/flexstudio",
    discord: "https://discord.gg/flexstudio",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Templates", href: "/templates" },
    { label: "Source Code", href: "/source-code" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
  ] as const,

  footer: {
    products: [
      { label: "Templates", href: "/templates" },
      { label: "Source Code", href: "/source-code" },
      { label: "SaaS Boilerplates", href: "/templates?category=saas" },
      { label: "Free Assets", href: "/templates?price=free" },
    ],
    services: [
      { label: "Website Development", href: "/services#development" },
      { label: "UI/UX Design", href: "/services#design" },
      { label: "SEO & Performance", href: "/services#seo" },
      { label: "Pricing & Calculator", href: "/pricing" },
    ],
    resources: [
      { label: "Support Center", href: "/support" },
      { label: "Setup Guide", href: "/setup" },
      { label: "Test Credentials", href: "/test-credentials" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact Desk", href: "/contact" },
      { label: "Freelance Rates", href: "/pricing" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refunds" },
      { label: "License Agreement", href: "/license" },
    ],
  },

  categories: [
    { name: "HTML", slug: "html", icon: "code" },
    { name: "Tailwind", slug: "tailwind", icon: "wind" },
    { name: "React", slug: "react", icon: "atom" },
    { name: "Next.js", slug: "nextjs", icon: "triangle" },
    { name: "Vue", slug: "vue", icon: "triangle" },
    { name: "PHP", slug: "php", icon: "code" },
    { name: "Laravel", slug: "laravel", icon: "code" },
    { name: "Shopify", slug: "shopify", icon: "shopping-bag" },
    { name: "WordPress", slug: "wordpress", icon: "globe" },
    { name: "Dashboard", slug: "dashboard", icon: "layout" },
    { name: "Portfolio", slug: "portfolio", icon: "user" },
    { name: "Landing Page", slug: "landing-page", icon: "rocket" },
    { name: "SaaS", slug: "saas", icon: "cloud" },
    { name: "Ecommerce", slug: "ecommerce", icon: "shopping-cart" },
    { name: "AI", slug: "ai", icon: "brain" },
    { name: "Agency", slug: "agency", icon: "building" },
    { name: "CRM", slug: "crm", icon: "database" },
    { name: "Education", slug: "education", icon: "book-open" },
  ],

  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Vue.js",
    "Nuxt.js",
    "Laravel",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Supabase",
    "Stripe",
  ],

  stats: [
    { label: "Products", value: "500+" },
    { label: "Downloads", value: "50K+" },
    { label: "Customers", value: "10K+" },
    { label: "Countries", value: "80+" },
  ],

  features: [
    {
      title: "Premium Quality",
      description: "Every product is reviewed for code quality, performance, and design standards.",
    },
    {
      title: "Clean Code",
      description: "Well-structured, documented, and maintainable code following best practices.",
    },
    {
      title: "Lifetime Updates",
      description: "Free updates for life. Stay current with the latest technologies and trends.",
    },
    {
      title: "Fast Support",
      description: "Dedicated support team ready to help within 24 hours.",
    },
    {
      title: "Modern Stack",
      description: "Built with the latest frameworks and industry-standard tools.",
    },
    {
      title: "SEO Friendly",
      description: "Optimized for search engines with proper metadata and structure.",
    },
    {
      title: "Responsive Design",
      description: "Pixel-perfect on every device — mobile, tablet, and desktop.",
    },
    {
      title: "Performance",
      description: "Lighthouse scores of 95+. Blazing fast load times.",
    },
  ],
} as const;
