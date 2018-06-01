import { createReducer } from 'redux-act'

import * as acts from './actions'

export interface State {
    visits: boolean
    bookmarks: boolean
    memexLinks: boolean
    visitDelay: number
}

const defaultState: State = {
    visits: true,
    bookmarks: true,
    memexLinks: true,
    visitDelay: 2,
}

const toggleState = key => (state: State) => ({
    ...state,
    [key]: !state[key],
})

const reducer = createReducer<State>({}, defaultState)

reducer.on(acts.toggleBookmarks, toggleState('bookmarks'))
reducer.on(acts.toggleLinks, toggleState('memexLinks'))
reducer.on(acts.toggleVisits, toggleState('visits'))
reducer.on(acts.changeVisitDelay, (state, visitDelay) => ({
    ...state,
    visitDelay,
}))

export default reducer
