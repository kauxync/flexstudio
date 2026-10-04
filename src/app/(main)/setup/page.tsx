"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Copy, Key, Shield } from "lucide-react";

function StepCard({ number, title, description, children }: { number: number; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="relative p-6 rounded-2xl border border-border/30 bg-card/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold text-sm font-bold">
          {number}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
  };

  return (
    <div className="relative group">
      <pre className="p-3 rounded-xl bg-muted/50 border border-border/30 text-xs font-mono overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 pointer-coarse:opacity-100 group-hover:opacity-100 transition-all"
      >
        <Copy className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="mb-5 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border-gold/20 bg-gold/5 text-gold rounded-full">
              Setup Guide
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              OAuth Setup Guide
            </h1>
            <p className="text-muted-foreground text-lg">
              Configure Google and GitHub login for your FlexStudio marketplace.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Current Status */}
          <AnimatedSection animation="fade-up">
            <div className="p-5 rounded-2xl border border-border/30 bg-card/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-gold" /> Current Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email/Password Login</span>
                  <Badge variant="success" className="text-[10px]">Working</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Google OAuth</span>
                  <Badge variant="warning" className="text-[10px]">Needs Setup</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GitHub OAuth</span>
                  <Badge variant="warning" className="text-[10px]">Needs Setup</Badge>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Google Setup */}
          <AnimatedSection animation="fade-up" delay={100}>
            <StepCard number={1} title="Google OAuth Setup" description="Create a Google Cloud project and OAuth credentials.">
              <div className="space-y-3 text-sm">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to <a href="https://console.cloud.google.com" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Go to <strong>APIs & Services</strong> → <strong>Credentials</strong></li>
                  <li>Click <strong>Create Credentials</strong> → <strong>OAuth 2.0 Client ID</strong></li>
                  <li>Set application type to <strong>Web application</strong></li>
                  <li>Add authorized redirect URI:</li>
                </ol>
                <CodeBlock>http://localhost:3000/api/auth/callback/google</CodeBlock>
                <p className="text-muted-foreground">Copy the Client ID and Client Secret to your <code className="px-1.5 py-0.5 rounded bg-muted text-xs">.env</code> file:</p>
                <CodeBlock>GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"</CodeBlock>
              </div>
            </StepCard>
          </AnimatedSection>

          {/* GitHub Setup */}
          <AnimatedSection animation="fade-up" delay={200}>
            <StepCard number={2} title="GitHub OAuth Setup" description="Create a GitHub OAuth App.">
              <div className="space-y-3 text-sm">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to <a href="https://github.com/settings/developers" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">GitHub Developer Settings <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Click <strong>New OAuth App</strong></li>
                  <li>Fill in the application name and homepage URL</li>
                  <li>Set callback URL to:</li>
                </ol>
                <CodeBlock>http://localhost:3000/api/auth/callback/github</CodeBlock>
                <p className="text-muted-foreground">Copy the Client ID and Client Secret to your <code className="px-1.5 py-0.5 rounded bg-muted text-xs">.env</code> file:</p>
                <CodeBlock>GITHUB_ID="your-client-id"
GITHUB_SECRET="your-client-secret"</CodeBlock>
              </div>
            </StepCard>
          </AnimatedSection>

          {/* Restart */}
          <AnimatedSection animation="fade-up" delay={300}>
            <StepCard number={3} title="Restart Development Server" description="After updating .env, restart the server.">
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Stop the current server and restart it:</p>
                <CodeBlock>npm run dev</CodeBlock>
                <p className="text-muted-foreground">The Google and GitHub login buttons will work once the credentials are configured.</p>
              </div>
            </StepCard>
          </AnimatedSection>

          {/* Production Note */}
          <AnimatedSection animation="fade-up" delay={400}>
            <div className="p-5 rounded-2xl border border-gold/20 bg-gold/5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gold" />
                <span className="font-semibold text-sm">Production Note</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For production, update the redirect URIs to use your domain (e.g., <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://yourdomain.com/api/auth/callback/google</code>) and set <code className="px-1.5 py-0.5 rounded bg-muted text-xs">NEXTAUTH_URL</code> to your production domain.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
