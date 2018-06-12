import db from '.'
import normalizeUrl from '../../util/encode-url-for-id'
import { createPageFromTab } from './on-demand-indexing'

interface Props {
    url: string
    tag: string
    tabId: number
}

const modifyTag = (shouldAdd: boolean) =>
    async function({ url, tag, tabId }: Props) {
        let page = await db.pages.get(normalizeUrl(url))

        if (page == null) {
            page = await createPageFromTab({ url, tabId })
        }

        return db.transaction('rw', db.tables, async () => {
            await page.loadRels()

            if (!page.visits.length) {
                page.addVisit() // Add new visit if none, else page won't appear in results
            }

            if (shouldAdd) {
                page.addTag(tag)
            } else {
                page.delTag(tag)
            }

            await page.save()
        })
    }

export const delTag = modifyTag(false)
export const addTag = modifyTag(true)
