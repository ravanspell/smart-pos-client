'use client';
import React, { useState } from 'react';
import { DashboardNav } from './dashboardNav';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

export const navItems: any[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        label: 'Dashboard'
    },
    {
        title: 'User',
        href: '/dashboard/user',
        icon: 'user',
        label: 'user'
    },
    {
        title: 'Employee',
        href: '/dashboard/employees',
        icon: 'employee',
        label: 'employee'
    },
    {
        title: 'Profile',
        href: '/dashboard/profile',
        icon: 'profile',
        label: 'profile'
    },
    {
        title: 'Kanban',
        href: '/dashboard/kanban',
        icon: 'kanban',
        label: 'kanban'
    },
    {
        title: 'File Management',
        href: '/dashboard/file-management',
        icon: 'file',
        label: 'file management'
    },
    {
        title: 'Login',
        href: '/',
        icon: 'login',
        label: 'login'
    }
];

type SidebarProps = {
    className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
    const [isMinimized, toggle] = useState<boolean>(false);

    const handleToggle = () => {
        toggle(!isMinimized);
    };

    return (
        <aside
            className={cn(
                `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
                !isMinimized ? 'w-60' : 'w-[72px]',
                className
            )}
        >
            <div className="hidden p-5 pt-10 lg:block">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
            </div>
            <ChevronLeft
                className={cn(
                    'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
                    isMinimized && 'rotate-180'
                )}
                onClick={handleToggle}
            />
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                        <DashboardNav items={navItems} isMinimized={isMinimized} />
                    </div>
                </div>
            </div>
        </aside>
    );
}