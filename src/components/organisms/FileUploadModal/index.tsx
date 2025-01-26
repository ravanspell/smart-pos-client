import { FC, lazy, useState } from 'react';
import Modal from '@/components/molecules/Modal';

const FileUploader = lazy(() => import('../FileUploader'));
const ModalActionButtons = lazy(() => import('../../molecules/ModalActionButtons'));

type FileUploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FileUploadModal: FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
    const [] = useState([])
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            description=""
            isLoading={false} // Optional loading indicator
        >
            <div className='mt-1'>
                <FileUploader
                    maxSize={1024 * 1024 * 1024 * 2} // 2GB
                    multiple accept={{ "image/*": [], "application/pdf": [] }}
                    maxFileCount={20}
                />
                <ModalActionButtons
                    secondaryAction={onClose}
                    primaryAction={() => { }}
                    primaryId="create-folder-submit-btn"
                    secondaryId="create-folder-cancel-btn"
                    isLoading={false}
                    primaryLabel='Confirm'
                    secondaryLabel='Cancel'
                />
            </div>
        </Modal>
    );
};

export default FileUploadModal;