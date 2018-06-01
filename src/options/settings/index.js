import React from 'react'

import { Wrapper } from '../../common-ui/components'
import SearchInjectionContainer from './components/SearchInjectionContainer'
import IndexingPrefs from './components/IndexingPrefs'

export { default as reducer } from './reducer'

export default () => (
    <Wrapper>
        <SearchInjectionContainer />
        <IndexingPrefs />
    </Wrapper>
)
