'use client'
import { UserNav } from './userNav';
import { ThemeToggle } from '@/components/utilComponents/theme-toggle';
import { Notifications } from './notifications';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import BreadcrumbComponent from '@/components/molecules/Breadcrumb';

export default function Header() {
    return (
        <header className="flex shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <nav className="flex items-center justify-between px-4 py-2 w-full">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <BreadcrumbComponent items={[{ label: 'home', href: '/dashboard/employees' }, { label: 'Dashboard', }]} />
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