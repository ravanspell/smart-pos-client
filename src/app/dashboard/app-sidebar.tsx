"use client"

import * as React from "react"
import {
    ChartBar,
    Origami,
    Settings2,
    Users,
    File as FileIcon,
    Briefcase,
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
    DEFAULT_SETTINGS_ROUTE,
    RECRUITMENT_ROUTE
} from "@/constants/routes"


const data = {
    navMain: [
        {
            title: "Dashboard",
            url: DASHBOARD_ROUTE,
            icon: ChartBar,
            isActive: true,
        },
        {
            title: "Employees",
            url: EMPLOYEES_ROUTE,
            icon: Users,
        },
        {
            title: "Recruitment",
            url: RECRUITMENT_ROUTE,
            icon: Briefcase,
        },
        {
            title: "File Management",
            icon: FileIcon,
            url: FILE_MANAGEMENT_ROUTE,
            items: [
                {
                    title: "My Files",
                    url: FILE_MANAGEMENT_ROUTE,
                },
                {
                    title: "Shared Files",
                    url: "#",
                },
                {
                    title: "Trash",
                    url: "#",
                }
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
