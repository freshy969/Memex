import * as React from 'react'

import Checkbox from './Checkbox'
const styles = require('./Settings.css')

export type CheckboxToggle = (
    event: React.SyntheticEvent<HTMLInputElement>,
) => void

export interface Props {
    visitDelay: number
    visits: boolean
    bookmarks: boolean
    memexLinks: boolean
    toggleVisits: CheckboxToggle
    toggleBookmarks: CheckboxToggle
    toggleLinks: CheckboxToggle
}

class IndexingPrefs extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        visitDelay: 2,
        visits: true,
        bookmarks: true,
        memexLinks: true,
    }

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
                >
                    All that I stayed on for more than{' '}
                    <input
                        type="number"
                        value={this.props.visitDelay}
                        min={2}
                        max={10}
                    />{' '}
                    seconds.
                </Checkbox>
                <Checkbox
                    isChecked={this.props.bookmarks}
                    handleChange={this.props.toggleBookmarks}
                >
                    All that I bookmarked
                </Checkbox>
                <Checkbox
                    isChecked={this.props.memexLinks}
                    handleChange={this.props.toggleLinks}
                >
                    All that I made Memex.Links on
                </Checkbox>
                <p className={styles.subText}>
                    Did you know? You can also blacklist domains and urls.
                </p>
            </div>
        )
    }
}

export default IndexingPrefs
