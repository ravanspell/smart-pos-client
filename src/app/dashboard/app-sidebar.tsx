"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    Origami,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/molecules/SideBar"
import { Separator } from "@/components/ui/separator"
import {
    DASHBOARD_ROUTE,
    EMPLOYEES_ROUTE,
    FILE_MANAGEMENT_ROUTE,
    DEFAULT_SETTINGS_ROUTE
} from "@/constants/routes"


const data = {
    navMain: [
        {
            title: "Dashboard",
            url: DASHBOARD_ROUTE,
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Employees",
            url: EMPLOYEES_ROUTE,
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "File Management",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: FILE_MANAGEMENT_ROUTE,
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: DEFAULT_SETTINGS_ROUTE,
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props} >
            <SidebarHeader>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Origami className="size-4" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <Separator />
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
