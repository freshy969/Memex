import React from 'react'

import { Wrapper } from '../../common-ui/components'
import SearchInjection from './components/SearchInjectionContainer'
import IndexingPrefs from './components/IndexingPrefsContainer'

export { default as reducer } from './reducer'

export default () => (
    <Wrapper>
        <SearchInjection />
        <IndexingPrefs />
    </Wrapper>
)
