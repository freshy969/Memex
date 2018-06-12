import analysePage from '../../page-analysis/background'
import fetchPageData from '../../page-analysis/background/fetch-page-data'
import pipeline from './pipeline'
import { Page } from './models'

interface Props {
    url: string
    tabId?: number
}

export async function createPageFromTab({
    url,
    tabId,
    ...pageAnalysisArgs
}: Props) {
    if (tabId == null) {
        throw new Error(`No tabID provided to extract content: ${url}`)
    }

    const analysisRes = await analysePage({
        tabId,
        allowFavIcon: false,
        ...pageAnalysisArgs,
    })

    const pageData = await pipeline({ pageDoc: { ...analysisRes, url } })

    return new Page(pageData)
}

export async function createPageFromUrl({ url, ...fetchDataArgs }: Props) {
    const fetchRes = await fetchPageData({
        url,
        opts: {
            includePageContent: true,
            includeFavIcon: false,
            ...fetchDataArgs,
        },
    }).run()

    const pageData = await pipeline({ pageDoc: { ...fetchRes, url } })

    return new Page(pageData)
}
