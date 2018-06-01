import { createAction } from 'redux-act'

export const toggleBookmarks = createAction('index-prefs/bookmarks')
export const toggleVisits = createAction('index-prefs/visits')
export const toggleLinks = createAction('index-prefs/links')
export const changeVisitDelay = createAction<number>('index-prefs/visitDelay')
