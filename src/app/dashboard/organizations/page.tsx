'use client';

import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import { PageContainer } from '@/components/atoms/PageContainer';
import OrganizationList from '@/components/molecules/OrganizationList';

function OrganizationsPage() {
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <OrganizationList />
    </PageContainer>
  );
}

export default OrganizationsPage;