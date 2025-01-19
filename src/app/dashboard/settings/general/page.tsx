"use client";

import React from 'react';
import { AnnouncementExpireForm } from './announcementExpireForm';
import { Separator } from '@/components/ui/separator';

const Settings: React.FC = () => {
    return (
        <>
            <div>
                <div>Announcement Expire</div>
                <div className='mt-1'>
                    <Separator />
                    <div className='mt-1'>
                        <AnnouncementExpireForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;