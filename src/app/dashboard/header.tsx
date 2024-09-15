'use client'
import { UserNav } from './userNav';
import { ThemeToggle } from '@/components/utilComponents/theme-toggle';
import { Notifications } from './notifications';

export default function Header() {
    return (
        <header className="sticky inset-x-0 top-0 w-full">
            <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
                <div className="flex items-center gap-2">
                    <UserNav />
                    <Notifications />
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}