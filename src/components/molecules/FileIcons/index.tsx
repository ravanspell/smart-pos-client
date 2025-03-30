import {
    Folder,
    FileText,
    FileSpreadsheet,
    Image as LucideImage,
    FileVideo,
    FileX,
    File
} from 'lucide-react';

type FileIconProps = {
    fileName: string;
};

const getIconByExtension = (extension: string) => {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return <File className="text-red-600" />;
        // case 'doc':
        // case 'docx':
        //   return <FileWord className="text-blue-600" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet className="text-green-600" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            // eslint-disable-next-line jsx-a11y/alt-text
            // this not an image, it's a file icon
            return <LucideImage className="text-yellow-600" />;
        // case 'ppt':
        // case 'pptx':
        //   return <FilePpt className="text-orange-600" />;
        case 'mp4':
            return <FileVideo className="text-purple-600" />;
        case 'txt':
            return <FileText className="text-gray-600" />;
        default:
            return <FileX className="text-gray-600" />; // Default icon for unknown file types
    }
};

const FileIcon: React.FC<FileIconProps> = ({ fileName }) => {
    // Check if there's a file extension
    const hasExtension = fileName.includes('.');
    const extension = hasExtension ? fileName.split('.').pop()!.toLowerCase() : null;

    // Determine icon to render
    const icon = hasExtension && extension ? getIconByExtension(extension) : <Folder className="text-yellow-500" />;

    return (
        <div className="flex items-center gap-2">
            {icon}
            <span>{fileName}</span>
        </div>
    );
};

export default FileIcon;
