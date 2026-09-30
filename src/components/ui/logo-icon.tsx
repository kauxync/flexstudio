import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

export function LogoIcon({
  size = 32,
  className,
  alt = "FlexStudio Logo",
  priority = false,
}: LogoIconProps) {
  return (
    <span
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={className && (className.includes("w-") || className.includes("h-")) ? undefined : { width: size, height: size }}
    >
      {/* Light Mode Logo Icon (Dark artwork for light backgrounds) */}
      <Image
        src="/logo-icon-light.png"
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-contain block dark:hidden"
        priority={priority}
      />
      {/* Dark Mode Logo Icon (Light artwork for dark backgrounds) */}
      <Image
        src="/logo-icon-dark.png"
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-contain hidden dark:block"
        priority={priority}
      />
    </span>
  );
}
