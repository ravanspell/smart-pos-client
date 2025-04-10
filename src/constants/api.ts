export const AUTH = {
    LOGIN: '/auth/login',
    AUTH_INFO: '/auth/info',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forget-password'
};

export const FILE_MGT = {
    CREATE_FOLDER: 'v1/file-management/create-folder',
    GET_BREADCRUMBS: 'file-management/breadcrumb/',
    INITIATE_UPLOAD: 'v1/file-management/upload/init',
    RENAME_FILE: 'file-management/rename-file',
    RENAME_FOLDER: 'file-management/rename-folder',
    GET_FOLDER_CONTENTS: 'v1/file-management',
    CONFIRM_UPLOAD: 'v1/file-management/upload/confirm'
}

export const APP = {
    WAKEUP: 'https://nrxdjpywxpxlb2eimjiakcsv640fdrrc.lambda-url.ap-southeast-1.on.aws/',
    UPDATE_ACTIVITY: 'app/update-activity'
}

export const CANDIDATES = {
    CREATE_CANDIDATE: 'v1/candidate/create-candidates',
    SEARCH_CANDIDATES: '/v1/candidate',
    GET_CANDIDATE: '/v1/candidate'
}