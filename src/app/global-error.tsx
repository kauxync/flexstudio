"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground antialiased">
        <div className="text-center px-4 max-w-md">
          {/* Large number */}
          <div className="relative mb-8">
            <span className="text-[12rem] sm:text-[16rem] font-bold leading-none text-foreground/[0.04] select-none font-serif">
              !
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl sm:text-7xl font-bold text-primary font-serif">
                !
              </span>
            </div>
          </div>

          {/* Accent line */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif">
            Critical Error
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            A critical error occurred. Please refresh the page or contact support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
