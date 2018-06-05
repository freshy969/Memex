import { createAction } from 'redux-act'

export const initBookmarks = createAction('index-prefs/init-bookmarks')
export const initVisits = createAction('index-prefs/init-visits')
export const initLinks = createAction('index-prefs/init-links')
export const initVisitDelay = createAction('index-prefs/init-visit-delay')

export const toggleBookmarks = createAction('index-prefs/toggle-bookmarks')
export const toggleVisits = createAction('index-prefs/toggle-visits')
export const toggleLinks = createAction('index-prefs/toggle-links')

export const changeVisitDelay = createAction<number>(
    'index-prefs/change-visit-delay',
)
