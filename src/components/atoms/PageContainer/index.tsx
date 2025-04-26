import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}
/**
 * PageContainer is a component that wraps the content of a page.
 * It provides a container with a fixed width and padding.
 * 
 * @param {PageContainerProps} props - The props for the PageContainer component.
 * @param {React.ReactNode} props.children - The content of the page.
 * @param {string} [props.className] - The class name for the container.
 */
const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container mx-auto py-6", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PageContainer.displayName = "PageContainer"

export { PageContainer } 