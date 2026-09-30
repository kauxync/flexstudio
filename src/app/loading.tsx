export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      <div className="relative flex flex-col items-center">
        {/* Animated logo/brand mark */}
        <div className="relative mb-8">
          <div className="w-16 h-16 rounded-2xl border-2 border-border/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          </div>
        </div>

        {/* Text */}
        <p className="text-sm text-muted-foreground/60 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
