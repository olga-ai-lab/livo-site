import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border border-foreground",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(53,62,74,1)]",
        teal: "bg-[#056677] text-white hover:bg-[#044D5A] shadow-[4px_4px_0px_0px_rgba(53,62,74,1)]",
        azure: "bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-[4px_4px_0px_0px_rgba(53,62,74,1)]",
        lime: "bg-[#7AB72D] text-white hover:bg-[#5E9020] shadow-[4px_4px_0px_0px_rgba(53,62,74,1)]",
        outline: "bg-transparent text-foreground hover:bg-accent shadow-[4px_4px_0px_0px_rgba(53,62,74,1)]",
        ghost: "border-none shadow-none hover:bg-accent hover:text-accent-foreground active:translate-x-0 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline border-none shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-10 px-4",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const BrutalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
BrutalButton.displayName = "BrutalButton"

export { BrutalButton, buttonVariants }
