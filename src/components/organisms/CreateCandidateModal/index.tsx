'use client';

import { FC } from 'react';
import Modal from '@/components/molecules/Modal';
import { CreateCandidateForm } from './CreateCandidateForm';

interface CreateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCandidateModal: FC<CreateCandidateModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Candidates"
      description="Upload resumes to add new candidates."
    >
      <CreateCandidateForm onClose={onClose} />
    </Modal>
  );
};

export default CreateCandidateModal; 