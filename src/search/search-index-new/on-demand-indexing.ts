import analysePage from '../../page-analysis/background'
import fetchPageData from '../../page-analysis/background/fetch-page-data'
import pipeline from './pipeline'
import { Page } from './models'

interface Props {
    url: string
    tabId?: number
    stubOnly?: boolean
}

export async function createPageFromTab({
    url,
    tabId,
    stubOnly = false,
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

    if (stubOnly && analysisRes.content) {
        delete analysisRes.content.fullText
    }

    const pageData = await pipeline({ pageDoc: { ...analysisRes, url } })

    return new Page(pageData)
}

export async function createPageFromUrl({
    url,
    stubOnly = false,
    ...fetchDataArgs
}: Props) {
    const fetchRes = await fetchPageData({
        url,
        opts: {
            includePageContent: true,
            includeFavIcon: false,
            ...fetchDataArgs,
        },
    }).run()

    if (stubOnly && fetchRes.content) {
        delete fetchRes.content.fullText
    }

    const pageData = await pipeline({ pageDoc: { ...fetchRes, url } })

    return new Page(pageData)
}

/**
 * Decides which type of on-demand page indexing logic to run based on given props.
 */
export default function(props: Props) {
    if (props.tabId) {
        return createPageFromTab(props)
    }

    return createPageFromUrl(props)
}
