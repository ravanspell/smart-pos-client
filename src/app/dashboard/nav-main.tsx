"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

interface SideBarMenuItem {
    title: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

export function NavMain({
    items,
}: {
    items: SideBarMenuItem[]
}) {

    const renderSideBarMenuItemButton = (item: SideBarMenuItem): React.ReactNode => {
        return (
            <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                {item?.url ? (
                    <Link className="w-full" href={item.url} > {item.title} </Link>
                ) : (<span>{item.title}</span>)}
                {(item?.items || []).length > 0 &&
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                }
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) =>
                    ((item?.items || []).length > 0) ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    {renderSideBarMenuItemButton(item)}
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {(item?.items || []).map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={subItem.url}>{subItem.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        renderSideBarMenuItemButton(item)
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}