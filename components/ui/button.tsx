"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluno-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default:   "bg-gradient-to-r from-fluno-purple to-fluno-purple-dark text-white rounded-full hover:opacity-90 hover:shadow-lg hover:shadow-fluno-purple/30",
        outline:   "border-2 border-fluno-purple text-fluno-purple rounded-full hover:bg-fluno-purple hover:text-white",
        ghost:     "text-fluno-ink/70 rounded-full hover:bg-fluno-lavender hover:text-fluno-purple",
        secondary: "bg-fluno-lavender text-fluno-purple rounded-full hover:bg-fluno-purple/20",
        destructive: "bg-red-500 text-white rounded-full hover:bg-red-600",
        white:     "border-2 border-white/30 text-white rounded-full hover:border-fluno-purple hover:bg-fluno-purple/20",
      },
      size: {
        sm:   "text-xs px-4 py-2",
        default: "text-sm px-6 py-3",
        lg:   "text-base px-8 py-4",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
