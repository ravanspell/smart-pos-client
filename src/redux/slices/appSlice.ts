import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type Breadcrumb = {
  label: string;
  href: string;
};

type ErrorState = {
  sectionId: string;
  message: string;
  type: 'network' | 'validation' | 'server';
};


type AppState = {
  theme: 'light' | 'dark';
  notifications: string[];
  breadcrumbs: Breadcrumb[];
  errors: Record<string, ErrorState>;
};

const initialState: AppState = {
  theme: 'light',
  notifications: [],
  breadcrumbs: [],
  errors: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * Action to toggle the application theme.
     * @param state - The current state of the application.
     */
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    /**
     * Action to add a notification message.
     * @param state - The current state of the application.
     * @param action - The action containing the notification message to add.
     */
    addNotification(state, action: PayloadAction<string>) {
      state.notifications.push(action.payload);
    },

    /**
     * Action to clear all notifications.
     * @param state - The current state of the application.
     */
    clearNotifications(state) {
      state.notifications = [];
    },

    /**
     * Action to set breadcrumbs for the current page.
     * @param state - The current state of the application.
     * @param action - The action containing the breadcrumbs array.
     */
    setBreadcrumbs(state, action: PayloadAction<Breadcrumb[]>) {
      state.breadcrumbs = action.payload;
    },

    /**
     * Action to clear breadcrumbs (e.g., when leaving a page).
     * @param state - The current state of the application.
     */
    clearBreadcrumbs(state) {
      state.breadcrumbs = [];
    },
    /**
     * Action to set an error state for a specific section.
     * @param action - Contains `sectionId` and error details.
     */
    setError(
      state,
      action: PayloadAction<{ sectionId: string; message: string; type: 'network' | 'validation' | 'server' }>
    ) {
      const { sectionId, message, type } = action.payload;
      state.errors[sectionId] = { sectionId, message, type };
    },

    /**
     * Action to clear an error state for a specific section.
     * @param action - Contains the `sectionId` to clear.
     */
    clearError(state, action: PayloadAction<{ sectionId: string }>) {
      const { sectionId } = action.payload;
      delete state.errors[sectionId];
    },
  },
  selectors: {
    /**
     * Selector to get the current theme.
     * @param app - The current state of the application.
     * @returns The current theme.
     */
    getTheme: (app: AppState) => app.theme,

    /**
     * Selector to get all notification messages.
     * @param app - The current state of the application.
     * @returns The list of notifications.
     */
    getNotifications: (app: AppState) => app.notifications,

    /**
     * Selector to get the current breadcrumbs.
     * @param app - The current state of the application.
     * @returns The current breadcrumbs array.
     */
    getBreadcrumbs: (app: AppState) => app.breadcrumbs,
    getSectionError: (app: AppState, errorId: string) => app.errors[errorId]
  },
});

/**
 * Exported actions from the application slice.
 */
export const {
  toggleTheme,
  addNotification,
  clearNotifications,
  setBreadcrumbs,
  clearBreadcrumbs,
  setError,
  clearError
} = appSlice.actions;

/**
 * Default export of the application reducer.
 */
export const {
  getBreadcrumbs,
  getNotifications,
  getSectionError
} = appSlice.selectors;

/**
 * Default export of the application reducer.
 */
export default appSlice.reducer;

