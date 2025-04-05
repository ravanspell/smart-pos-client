import { FC, lazy } from 'react';
import Modal from '@/components/molecules/Modal';

const FileUploader = lazy(() => import('../FileUploader'));

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
                    <FileUploader
                        maxSize={1024 * 1024 * 1024 * 2} // 2GB
                        multiple accept={{ "image/*": [], "application/pdf": [] }}
                        maxFileCount={20}
                        onCancel={onClose}
                        parentId={parentId}
                    />
                )}
            </div>
        </Modal>
    );
};

export default FileUploadModal;