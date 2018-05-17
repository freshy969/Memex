import React from 'react'
import PropTypes from 'prop-types'
import OnClickOutside from 'react-onclickoutside'

import Tooltip from './tooltip'
import { createDirectLink } from 'src/direct-linking/content_script/interactions'
import {
    InitialComponent,
    CreatingLinkComponent,
    CreatedLinkComponent,
    CopiedComponent,
    ErrorComponent,
} from './tooltipStates'
import { copyToClipboard } from '../utils'

class Container extends React.Component {
    static propTypes = {
        onInit: PropTypes.func.isRequired,
    }

    state = {
        showTooltip: false,
        position: {},
        tooltipState: 'pristine',
        linkURL: '',
    }

    componentDidMount() {
        this.props.onInit(this.showTooltip)
    }

    showTooltip = position =>
        this.setState({
            showTooltip: true,
            position,
            tooltipState: 'pristine',
        })

    handleClickOutside = () =>
        this.setState({
            showTooltip: false,
            position: {},
        })

    setTooltipState = state =>
        this.setState({
            tooltipState: state,
        })

    createLink = async () => {
        this.setState({
            tooltipState: 'running',
        })
        const { url } = await createDirectLink()
        this.setState({
            tooltipState: 'done',
            linkURL: url,
        })
    }

    copyLinkToClipboard = event => {
        event.preventDefault()
        copyToClipboard(this.state.linkURL)
        this.setState({
            tooltipState: 'copied',
        })
    }

    renderTooltipComponent = () => {
        switch (this.state.tooltipState) {
            case 'pristine':
                return <InitialComponent createLink={this.createLink} />
            case 'running':
                return <CreatingLinkComponent />
            case 'done':
                return (
                    <CreatedLinkComponent
                        link={this.state.linkURL}
                        copyFunc={this.copyLinkToClipboard}
                    />
                )
            case 'copied':
                return <CopiedComponent />
            default:
                return <ErrorComponent />
        }
    }

    render() {
        const { showTooltip, position, tooltipState } = this.state
        return (
            <div className="memex-tooltip-container">
                {showTooltip ? (
                    <Tooltip
                        {...position}
                        state={tooltipState}
                        tooltipComponent={this.renderTooltipComponent()}
                    />
                ) : null}
            </div>
        )
    }
}

export default OnClickOutside(Container)