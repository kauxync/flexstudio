import { Wrench, Mail } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      {/* Floating orbs */}
      <div className="absolute top-1/3 left-[15%] w-64 h-64 rounded-full bg-gold/5 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-[20%] w-48 h-48 rounded-full bg-primary/5 blur-[80px] animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative text-center px-4 max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gold/10 text-gold border border-gold/20">
            <Wrench className="w-8 h-8" />
          </div>
        </div>

        {/* Gold line */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Message */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Under Maintenance
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          We&apos;re currently performing scheduled maintenance to improve your experience.
          We&apos;ll be back online shortly.
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
          </span>
          Estimated: 30 minutes
        </div>

        {/* Notify */}
        <div className="p-6 rounded-2xl border border-border/30 bg-card/20">
          <p className="text-sm text-muted-foreground mb-4">
            Get notified when we&apos;re back online
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-10 px-4 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-primary-fg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
