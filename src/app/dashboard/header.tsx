'use client'

import { UserNav } from './userNav';
import { ThemeToggle } from '@/components/utilComponents/theme-toggle';
import { Notifications } from './notifications';
import { SidebarTrigger } from '@/components/molecules/SideBar';
import { Separator } from '@/components/ui/separator';
import BreadcrumbComponent from '@/components/molecules/Breadcrumb';
import { useSelector } from 'react-redux';
import { getBreadcrumbs } from '@/redux/slices/appSlice';

export default function Header() {
    const breadcrumbItems = useSelector(getBreadcrumbs);
    return (
        <header className="flex shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <nav className="flex items-center justify-between px-4 py-2 w-full">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <BreadcrumbComponent
                        items={breadcrumbItems}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Notifications />
                    <UserNav />
                </div>
            </nav>
        </header>
    );
}