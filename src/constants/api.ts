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
    CONFIRM_UPLOAD: 'v1/file-management/upload/confirm',
    // TODO: should be under file mgt
    GET_STORAGE_INFO: 'v1/organization/storage'
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

export const JOBS = {
    CREATE_JOB: 'v1/jobs',
    GET_JOBS: 'v1/jobs',
    GET_JOB_BY_ID: 'v1/jobs',
    UPDATE_JOB: 'v1/jobs',
    DELETE_JOB: 'v1/jobs'
}

export const PERMISSIONS = {
    GET_PERMISSION_CATEGORIES: 'v1/permission-categories',
    CREATE_PERMISSION_CATEGORY: 'v1/permission-categories',
    UPDATE_PERMISSION_CATEGORY: 'v1/permission-categories',
    DELETE_PERMISSION_CATEGORY: 'v1/permission-categories'
}