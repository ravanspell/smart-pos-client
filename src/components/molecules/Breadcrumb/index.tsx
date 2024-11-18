import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu"
import { Fragment } from "react"

interface BreadcrumbData {
  label: string
  href?: string
}

interface BreadcrumbComponentProps {
  items: BreadcrumbData[]
}

function BreadcrumbComponent({ items }: BreadcrumbComponentProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First breadcrumb item */}
        {items.length > 1 &&
          <BreadcrumbItem key={items[0].label}>
            <BreadcrumbLink href={items[0].href}>{items[0].label}</BreadcrumbLink>
          </BreadcrumbItem>
        }

        {/* Separator between the first and dropdown */}
        {items.length > 1 && <BreadcrumbSeparator />}

        {/* Middle dropdown if items exceed 4 */}
        {items.length > 4 && (
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <BreadcrumbEllipsis className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {items.slice(1, items.length - 2).map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        )}

        {/* If items length <= 4, render middle items directly */}
        {items.length <= 4 && items.length > 1 &&
          items.slice(1, items.length - 1).map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem >
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator key={`seperator_${index}`} />
            </Fragment>
          ))}

        {/* Last breadcrumb item(s) */}
        {items.length > 4 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={items[items.length - 2].href}>
                {items[items.length - 2].label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{items[items.length - 1].label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem key={items[items.length - 1].label}>
            <BreadcrumbPage>{items[items.length - 1].label}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbComponent;
