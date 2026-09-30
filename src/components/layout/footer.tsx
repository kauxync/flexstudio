"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, CreditCard, Sparkles, ArrowRight } from "lucide-react";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 font-serif">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-muted-foreground/80 hover:text-primary transition-colors duration-200 block py-0.5"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const logoFilter = isDark ? "invert(1) brightness(2)" : "none";

  return (
    <footer className="relative border-t border-border/40 bg-card/20 backdrop-blur-xl">
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 py-16 lg:py-20">
          {/* Brand & Studio Mission */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center group">
              <img
                src="/logo.svg"
                alt="FlexStudio"
                className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                style={{ filter: logoFilter }}
              />
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              FlexStudio is a premium digital marketplace and full-stack engineering studio. We build production-ready Next.js templates, commercial source code, and custom web applications for founders and agencies worldwide.
            </p>

            {/* Developer Availability Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Freelance Web Engineering: Available for Projects
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all"
                aria-label="Twitter / X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all"
                aria-label="Discord"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 8A2.5 2.5 0 0 1 20 10.5v4a2.5 2.5 0 0 1-5 0v-4A2.5 2.5 0 0 1 17.5 8" />
                  <path d="M6.5 8A2.5 2.5 0 0 1 9 10.5v4a2.5 2.5 0 0 1-5 0v-4A2.5 2.5 0 0 1 6.5 8" />
                  <path d="M8.5 2c3.3.5 5.5 2 6.5 4" />
                  <path d="M15.5 2c-3.3.5-5.5 2-6.5 4" />
                  <path d="M8.5 22c3.3-.5 5.5-2 6.5-4" />
                  <path d="M15.5 22c-3.3-.5-5.5-2-6.5-4" />
                  <path d="M8.5 6v4" />
                  <path d="M15.5 6v4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <FooterColumn title="Products" links={siteConfig.footer.products} />
          <FooterColumn title="Services" links={siteConfig.footer.services} />
          <FooterColumn title="Resources" links={siteConfig.footer.resources} />
          <FooterColumn title="Company" links={siteConfig.footer.company} />
        </div>

        {/* Trust Badges Strip */}
        <div className="py-6 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary shrink-0" />
            <span>Cashfree UPI &amp; Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instant Download Access</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Code &amp; IP Ownership</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Lifetime Updates Included</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border/20 text-xs text-muted-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} FlexStudio. All rights reserved. Built with Next.js 16 &amp; Tailwind CSS.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            {siteConfig.footer.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
