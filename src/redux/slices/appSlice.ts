import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type Breadcrumb = {
  label: string;
  href: string;
};

type AppState = {
  theme: 'light' | 'dark'; 
  notifications: string[];
  breadcrumbs: Breadcrumb[];
};


const initialState: AppState = {
  theme: 'light',
  notifications: [],
  breadcrumbs: [],
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
} = appSlice.actions;

/**
 * Default export of the application reducer.
 */
export default appSlice.reducer;