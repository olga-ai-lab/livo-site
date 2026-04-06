import * as React from "react"
import { cn } from "@/lib/utils"

const BrutalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground border border-border shadow-[4px_4px_0px_0px_rgba(203,213,225,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(203,213,225,1)] transition-all duration-200",
      className
    )}
    {...props}
  />
))
BrutalCard.displayName = "BrutalCard"

const BrutalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-border/50", className)}
    {...props}
  />
))
BrutalCardHeader.displayName = "BrutalCardHeader"

const BrutalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-bold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
BrutalCardTitle.displayName = "BrutalCardTitle"

const BrutalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-body", className)}
    {...props}
  />
))
BrutalCardDescription.displayName = "BrutalCardDescription"

const BrutalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-6", className)} {...props} />
))
BrutalCardContent.displayName = "BrutalCardContent"

const BrutalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
BrutalCardFooter.displayName = "BrutalCardFooter"

export { BrutalCard, BrutalCardHeader, BrutalCardFooter, BrutalCardTitle, BrutalCardDescription, BrutalCardContent }
