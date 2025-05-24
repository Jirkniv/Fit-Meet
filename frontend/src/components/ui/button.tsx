import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-33 h-14",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-color-500)] h-12  text-primary-foreground shadow-xs hover:cursor-pointer hover:bg-[var(--primary-color-600)] focus-visible:ring-[var(--primary-color-500)]/20 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80 dark:focus-visible:ring-primary/40",
        destructive:
          "bg-destructive text-white h-12 shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 text-[var(--primary-color-500)] h-12 border-[var(--primary-color-500)] bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer",
        secondary:
          "bg-[var(--primary-color-500)] hover:cursor-pointer hover:bg-[var(--primary-color-600)] shadow-xs  w-27 h-10 text-white",
        ghost:
          "hover:bg-accent hover:text-accent-foreground h-12 dark:hover:bg-accent/50 cursor-pointer",
        link: "text-primary underline-offset-4 hover:underline ",
      },
      size: {
        default: "h-12 px-4 py-2 has-[>svg]:px-3",
        sm: "h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp 
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
