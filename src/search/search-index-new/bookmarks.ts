import { Bookmarks } from 'webextension-polyfill-ts'

import db from '.'
import normalizeUrl from '../../util/encode-url-for-id'
import { createPageFromTab, createPageFromUrl } from './on-demand-indexing'

export async function addBookmark({
    url,
    timestamp = Date.now(),
    tabId,
}: {
    url: string
    timestamp: number
    tabId: number
}) {
    let page = await db.pages.get(normalizeUrl(url))

    if (page == null) {
        page = await createPageFromTab({ url, tabId })
    }

    return db.transaction('rw', db.tables, async () => {
        await page.loadRels()
        page.setBookmark(timestamp)
        await page.save()
    })
}

export function delBookmark({ url }: Bookmarks.BookmarkTreeNode) {
    return db.transaction('rw', db.tables, async () => {
        const page = await db.pages.get(normalizeUrl(url))

        if (page != null) {
            await page.loadRels()
            page.delBookmark()

            // Delete if Page left orphaned, else just save current state
            if (page.shouldDelete) {
                await page.delete()
            } else {
                await page.save()
            }
        }
    })
}

/**
 * Handles the browser `bookmarks.onCreated` event:
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/bookmarks/onCreated
 */
export async function handleBookmarkCreation(
    browserId: string,
    { url }: Bookmarks.BookmarkTreeNode,
) {
    try {
        let page = await db.pages.get(normalizeUrl(url))

        // No existing page for BM; need to try and make new from a remote DOM fetch
        if (page == null) {
            page = await createPageFromUrl({ url })
        }

        await db.transaction('rw', db.tables, async () => {
            await page.loadRels()
            page.setBookmark()
            await page.save()
        })
    } catch (err) {
        console.error(err)
    }
}
