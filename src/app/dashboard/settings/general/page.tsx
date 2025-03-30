"use client";

import React from 'react';
import { AnnouncementExpireForm } from '../../../../components/organisms/announcementExpireForm';
import { Separator } from '@/components/ui/separator';
import SectionBoundary from '@/components/organisms/SectionStatusBoundary';

const Settings: React.FC = () => {
    return (
        <SectionBoundary
            isLoading={true}
            fetchMethod={() => { }}
            sectionId='general-settings-section'
        >
            <div>Announcement Expire</div>
            <div className='mt-1'>
                <Separator />
                <div className='mt-1'>
                    <AnnouncementExpireForm />
                </div>
            </div>
        </SectionBoundary>
    );
};

export default Settings;