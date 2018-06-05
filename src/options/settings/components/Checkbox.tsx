import * as React from 'react'

const styles = require('./Checkbox.css')

export type CheckboxToggle = (
    event: React.SyntheticEvent<HTMLInputElement>,
) => void

export interface Props {
    handleChange: CheckboxToggle
    isChecked: boolean
    children?: React.ReactChild | React.ReactChild[]
    id: string
}

class Checkbox extends React.PureComponent<Props> {
    render() {
        return (
            <div className={styles.container}>
                <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={this.props.isChecked}
                    onChange={this.props.handleChange}
                    id={this.props.id}
                />
                <label className={styles.checkboxText} htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        )
    }
}

export default Checkbox
