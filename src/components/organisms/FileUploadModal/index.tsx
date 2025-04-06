import { FC, lazy } from 'react';
import Modal from '@/components/molecules/Modal';

const FileUploadForm = lazy(() => import('../../molecules/FileUploadForm'));

type FileUploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    parentId: string;
};

const FileUploadModal: FC<FileUploadModalProps> = ({ isOpen, onClose, parentId }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Upload Files"
            description="Upload files to the current folder"
            isLoading={false}
        >
            <div className='mt-1'>
                {isOpen && (
                    <FileUploadForm
                        onCancel={onClose}
                        parentId={parentId}
                    />
                )}
            </div>
        </Modal>
    );
};

export default FileUploadModal;