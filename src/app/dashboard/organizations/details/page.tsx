'use client';

import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/atoms/PageContainer';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { ORGANIZATIONS_ROUTE } from '@/constants/routes';

export default function OrganizationDetailsPage() {
    const searchParams = useSearchParams();
    const organizationId = searchParams.get('id') as string;

    // Breadcrumb setup
    useBreadcrumb([{
        label: 'Organizations',
        href: ORGANIZATIONS_ROUTE,
    }, {
        label: 'Organization Details',
        href: '',
    }]);

    return (
        <PageContainer>
            <div>Organization permissions</div>
        </PageContainer>
    );
} 