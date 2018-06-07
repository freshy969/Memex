import { browser, Tabs } from 'webextension-polyfill-ts'

import searchIndex from '../../search'
import { blacklist } from '../../blacklist/background'
import { isLoggable, getPauseState } from '..'
import { TabState } from './types'
import { STORAGE_KEYS as IDXING_PREF_KEYS } from '../../options/settings/constants'

/**
 * Combines all "loggable" conditions for logging on given tab data to determine
 * whether or not a tab should be logged.
 */
export async function shouldLogTab({ url, incognito }: Tabs.Tab) {
    // Short-circuit before async logic, if possible
    if (incognito || !url || !isLoggable({ url })) {
        return false
    }

    // First check if we want to log this page (hence the 'maybe' in the name).
    const isBlacklisted = await blacklist.checkWithBlacklist()
    const isPaused = await getPauseState()

    if (isPaused || isBlacklisted({ url })) {
        return false
    }

    const {
        [IDXING_PREF_KEYS.BOOKMARKS]: shouldCheckBmTags,
        [IDXING_PREF_KEYS.LINKS]: shouldCheckLink,
        [IDXING_PREF_KEYS.VISITS]: shouldLogVisits,
    } = await browser.storage.local.get([
        IDXING_PREF_KEYS.BOOKMARKS,
        IDXING_PREF_KEYS.LINKS,
        IDXING_PREF_KEYS.VISITS,
    ])

    let shouldLog = shouldLogVisits

    if (shouldCheckBmTags) {
        const page = await searchIndex.getPage(url)

        if (page != null) {
            const hasBmOrTags = !!page.bookmark || !!page.tags.length
            shouldLog = shouldLog || hasBmOrTags
        }
    }

    if (shouldCheckLink) {
        // TODO: understand direct linking more and implement this properly
        shouldLog = shouldLog || false
    }

    return shouldLog
}

/**
 * Handles update of assoc. visit with derived tab state data, using the tab state.
 *
 * @param {Tab} tab The tab state to derive visit meta data from.
 */
export const updateVisitInteractionData = ({
    url,
    visitTime,
    activeTime,
    scrollState,
}: TabState) =>
    searchIndex
        .updateTimestampMeta(url, +visitTime, {
            duration: activeTime,
            scrollPx: scrollState.pixel,
            scrollMaxPx: scrollState.maxPixel,
            scrollPerc: scrollState.percent,
            scrollMaxPerc: scrollState.maxPercent,
        })
        .catch(f => f)
