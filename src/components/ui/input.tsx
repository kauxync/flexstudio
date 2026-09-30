import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, ...props }, ref) => (
    <div className="relative w-full">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export { Input, type InputProps };
