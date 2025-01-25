import { FC, lazy } from 'react';
import Modal from '@/components/molecules/Modal';

const CreateFolderForm = lazy(() => import('../CreateFolderForm'));

type CreateFolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFolderModal: FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a New Folder"
      description="Please enter a name for the new folder."
      isLoading={false} // Optional loading indicator
    >
      <CreateFolderForm onClose={onClose} />
    </Modal>
  );
};

export default CreateFolderModal;
