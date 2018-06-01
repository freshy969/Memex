import React from 'react'

import { Wrapper } from '../../common-ui/components'
import SearchInjectionContainer from './components/SearchInjectionContainer'
import IndexingPrefs from './components/IndexingPrefs'

export default () => (
    <Wrapper>
        <SearchInjectionContainer />
        <IndexingPrefs />
    </Wrapper>
)
