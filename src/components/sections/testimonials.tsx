"use client";

import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechStart Inc.",
    avatar: "SJ",
    rating: 5,
    content:
      "FlexStudio templates saved us weeks of development time. The code quality is exceptional and the documentation is thorough. Highly recommended.",
    verified: true,
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "AppForge",
    avatar: "MC",
    rating: 5,
    content:
      "We purchased the SaaS boilerplate and had our MVP running in just 3 days. The architecture is clean and scalable. Worth every penny.",
    verified: true,
  },
  {
    name: "Emily Rodriguez",
    role: "Lead Developer",
    company: "Digital Agency",
    avatar: "ER",
    rating: 5,
    content:
      "The UI kits are among the best I've used. Beautiful design, responsive layouts, and easy to customize. Our clients love the results.",
    verified: true,
  },
  {
    name: "David Kim",
    role: "CEO",
    company: "LaunchPad",
    avatar: "DK",
    rating: 5,
    content:
      "Outstanding support team. When we had a customization question, they responded within hours with detailed guidance. Rare to find.",
    verified: true,
  },
  {
    name: "Lisa Thompson",
    role: "Product Manager",
    company: "InnovateCo",
    avatar: "LT",
    rating: 5,
    content:
      "The dashboard template is incredibly well thought out. Every component works perfectly and the dark mode is gorgeous.",
    verified: true,
  },
  {
    name: "Alex Patel",
    role: "Full Stack Dev",
    company: "Freelance",
    avatar: "AP",
    rating: 5,
    content:
      "I've bought from many marketplaces, but FlexStudio is on another level. Clean, modern code that follows best practices. My go-to.",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={i < rating ? "text-gold" : "text-muted-foreground/20"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const avatarColors = [
  "from-[#1e1b4b] to-[#312e81]",
  "from-[#292524] to-[#44403c]",
  "from-[#1e1b4b] to-[#4338ca]",
  "from-[#1c1917] to-[#292524]",
  "from-[#312e81] to-[#4338ca]",
  "from-[#292524] to-[#57534e]",
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <Badge variant="outline" className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full">
            Testimonials
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Loved by developers
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See what our customers have to say
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.name} animation="fade-up" delay={i * 100}>
              <div
                className="group relative p-7 rounded-3xl border border-border/30 bg-card/20 hover:bg-card hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5 transition-all duration-700 h-full"
              >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

              <div className="relative">
                <StarRating rating={testimonial.rating} />

                <blockquote className="text-sm leading-relaxed mt-5 mb-6 text-foreground/70">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-5 border-t border-border/20">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-white text-xs font-bold shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{testimonial.name}</p>
                      {testimonial.verified && (
                        <Badge variant="outline" className="shrink-0 text-[9px] px-1.5 py-0 border-gold/30 text-gold tracking-wide uppercase">
                          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
