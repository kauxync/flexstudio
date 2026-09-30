"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { useMouseParallax } from "@/hooks/use-scroll-animation";
import { useTypingEffect } from "@/hooks/use-typing-effect";

const typingWords = [
  "digital experiences",
  "web applications",
  "SaaS products",
  "online stores",
  "landing pages",
];

export function Hero() {
  const { ref: parallaxRef, position } = useMouseParallax(0.015);
  const [loaded, setLoaded] = useState(false);
  const { currentText } = useTypingEffect({
    words: typingWords,
    typingSpeed: 45,
    deletingSpeed: 25,
    pauseDuration: 2000,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={parallaxRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 gradient-hero-light" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating orbs with parallax */}
      <div
        className="absolute top-32 left-[15%] w-72 h-72 rounded-full bg-gold/5 blur-[100px] animate-float-slow transition-transform duration-[2000ms] ease-out"
        style={{ transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px)` }}
      />
      <div
        className="absolute bottom-32 right-[10%] w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float-slow transition-transform duration-[2000ms] ease-out"
        style={{ transform: `translate(${position.x * -0.3}px, ${position.y * -0.3}px)`, animationDelay: "3s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[150px] transition-transform duration-[2000ms] ease-out"
        style={{ transform: `translate(calc(-50% + ${position.x * 0.2}px), calc(-50% + ${position.y * 0.2}px))` }}
      />

      {/* Decorative animated lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-primary/[0.06] to-transparent animate-fade-in" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-gold/[0.08] to-transparent animate-fade-in" style={{ animationDelay: "200ms" }} />
        <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-primary/[0.06] to-transparent animate-fade-in" style={{ animationDelay: "400ms" }} />
      </div>

      {/* Rotating decorative element */}
      <div className="absolute top-1/4 right-[10%] w-32 h-32 opacity-[0.03] animate-[spin_60s_linear_infinite]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="25" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="50" x2="95" y2="50" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top badge */}
          <div className={`flex justify-center mb-10 transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Badge
              variant="outline"
              className="px-5 py-2 text-xs font-medium tracking-wider uppercase border-gold/30 bg-gold/5 text-gold hover:bg-gold/10 transition-colors cursor-default rounded-full"
            >
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                </span>
                New Collection Available
              </span>
            </Badge>
          </div>

          {/* Headline */}
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-center leading-[0.95] mb-8 transition-all duration-1000 ease-out delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="block text-foreground">Craft exceptional</span>
            <span className="block mt-2">
              <span className="gradient-text-dark">{currentText}</span>
              <span className="inline-block w-[3px] h-[0.8em] ml-1 bg-gold align-middle animate-pulse" />
            </span>
          </h1>

          {/* Decorative gold line */}
          <div className={`flex justify-center mb-8 transition-all duration-1000 ease-out delay-200 ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          {/* Subheadline */}
          <p className={`text-lg sm:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 ease-out delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Premium templates, UI kits, and source code crafted with meticulous attention to detail.
            Build with confidence, launch with elegance.
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 ease-out delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link href="/templates">
              <Button size="xl" className="rounded-full px-10 bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10 hover:shadow-2xl hover:shadow-foreground/15 hover:scale-[1.02] transition-all duration-500 font-semibold">
                Explore Collection
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="xl" className="rounded-full px-10 border-border hover:bg-muted/50 transition-all duration-500">
                Our Services
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-16 transition-all duration-1000 ease-out delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {["Premium Quality", "Lifetime Updates", "24/7 Support", "Clean Code"].map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-2 text-sm text-muted-foreground transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
                style={{ transitionDelay: `${600 + i * 100}ms` }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 ease-out delay-[600ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {siteConfig.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group relative p-6 rounded-2xl border border-border/40 bg-card/40 hover:bg-card hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 transition-all duration-700 text-center overflow-hidden"
                style={{ transitionDelay: `${700 + i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative text-3xl sm:text-4xl font-bold gradient-text-gold mb-1">{stat.value}</div>
                <div className="relative text-sm text-muted-foreground tracking-wide uppercase text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 ease-out delay-[1000ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-border/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-gold/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
