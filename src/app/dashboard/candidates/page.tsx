'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import CandidatesInReview from '@/components/organisms/CandidatesInReview';
import CandidatesPool from '@/components/organisms/CandidatesPool';

// Lazy load the create candidate modal
const CreateCandidateModal = dynamic(
  () => import('@/components/organisms/CreateCandidateModal'),
  { ssr: false }
);

function CandidatesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Candidates
        </Button>
      </div>

      <div className="space-y-8">
        <CandidatesInReview />
        <CandidatesPool />
      </div>

      {isCreateModalOpen && (
        <CreateCandidateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

export default CandidatesPage;