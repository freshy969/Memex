import * as React from 'react'

import Checkbox, { CheckboxToggle } from './Checkbox'
const styles = require('./Settings.css')

export interface Props {
    bookmarks: boolean
    memexLinks: boolean
    stubs: boolean
    visits: boolean
    visitDelay: number
    toggleBookmarks: CheckboxToggle
    toggleLinks: CheckboxToggle
    toggleStubs: CheckboxToggle
    toggleVisits: CheckboxToggle
    handleVisitDelayChange: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

class IndexingPrefs extends React.PureComponent<Props> {
    render() {
        return (
            <div>
                <h1 className={styles.header}>Indexing Preferences</h1>
                <h3 className={styles.subHeader}>
                    Which websites do you want to make searchable?
                </h3>
                <Checkbox
                    isChecked={this.props.visits}
                    handleChange={this.props.toggleVisits}
                    id="index-visits"
                >
                    All that I stayed on for more than{' '}
                    <input
                        type="number"
                        value={this.props.visitDelay}
                        onChange={this.props.handleVisitDelayChange}
                        min={2}
                        max={10}
                    />{' '}
                    seconds.
                </Checkbox>
                <Checkbox
                    isChecked={this.props.bookmarks}
                    handleChange={this.props.toggleBookmarks}
                    id="index-bookmarks"
                >
                    All that I bookmarked
                </Checkbox>
                <Checkbox
                    isChecked={this.props.memexLinks}
                    handleChange={this.props.toggleLinks}
                    id="index-links"
                >
                    All that I made Memex.Links on
                </Checkbox>
                <Checkbox
                    isChecked={this.props.stubs}
                    handleChange={this.props.toggleStubs}
                    id="index-stubs"
                >
                    Make title and url always searchable (recommended)
                </Checkbox>
                <p className={styles.subText}>
                    Did you know? You can also blacklist domains and urls.
                </p>
            </div>
        )
    }
}

export default IndexingPrefs
