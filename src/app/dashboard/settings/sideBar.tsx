'use client'

import React from 'react';
import Link from 'next/link';
import { DEFAULT_SETTINGS_ROUTE } from '@/constants/routes';

export interface MenuItem {
    href: string;
    label: string;
}

const Sidebar: React.FC = () => {
    const menuItems: MenuItem[] = [
        { href: DEFAULT_SETTINGS_ROUTE, label: 'General Settings' },
        { href: '/settings/employee-permission', label: 'Employee Permission' },
        { href: '/settings/accessibility-restriction', label: 'Accessibility Restriction' },
        { href: '/settings/user-group', label: 'User Group' },
        { href: '/settings/date-time-format', label: 'Date & Time Format' },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <ul className="space-y-2">
                {menuItems.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;