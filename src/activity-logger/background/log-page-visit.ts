import { Tabs } from 'webextension-polyfill-ts'
import moment from 'moment'

import tabManager from './tab-manager'
import analysePage from '../../page-analysis/background'
import searchIndex from '../../search'

/**
 * Performs page data indexing for a browser tab. Immediately
 * indexes display data, and searchable title/URL terms, but returns
 * an async callback for manual invocation of text indexing.
 */
export async function logPageVisit(tab: Tabs.Tab, secsSinceLastVisit = 20) {
    const internalTabState = tabManager.getTabState(tab.id)

    // Cannot process if tab not tracked
    if (internalTabState == null) {
        return
    }

    try {
        const existingPage = await searchIndex.getPage(tab.url)

        if (existingPage != null) {
            // Store just new visit if existing page has been indexed recently (`secsSinceLastIndex`)
            //  also clear scheduled content indexing
            if (
                moment(existingPage.latest).isAfter(
                    moment(internalTabState.visitTime).subtract(
                        secsSinceLastVisit,
                        'seconds',
                    ),
                )
            ) {
                console.log('skipping page due to recent visit:', tab.url)
                tabManager.clearScheduledLog(tab.id)

                await searchIndex.addVisit(tab.url, internalTabState.visitTime)

                return
            }
        }

        const allowFavIcon = !(await searchIndex.domainHasFavIcon(tab.url))
        const analysisRes = await analysePage({ tabId: tab.id, allowFavIcon })

        // Don't index full-text in this stage
        delete analysisRes.content.fullText

        console.log('indexing page:', tab.url)
        await searchIndex.addPage({
            pageDoc: { url: tab.url, ...analysisRes },
            visits: [internalTabState.visitTime],
            rejectNoContent: false,
        })
    } catch (err) {
        tabManager.clearScheduledLog(tab.id)
        throw err
    }
}

export async function logPageText(tab: Tabs.Tab) {
    const { content } = await analysePage({
        tabId: tab.id,
        allowFavIcon: false,
        allowScreenshot: false,
    })

    await searchIndex.addPageTerms({
        pageDoc: { url: tab.url, content },
    })
}
