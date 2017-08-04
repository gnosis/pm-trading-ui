import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import { isArray } from 'lodash'
import autobind from 'autobind-decorator'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './formEditableList.less'

class FormEditableList extends Component {
  getValues() {
    const { input } = this.props
    if (isArray(input.value) && input.value.length > 0) {
      const values = input.value.slice(0)

      // if last entry is not empty, add a new line
      if (values[values.length - 1].length > 0) {
        values.push('')
      }

      return values
    }

    return ['']
  }

  @autobind
  handleEntryChange(index, event) {
    const { input: { onChange } } = this.props
    const values = this.getValues()

    values[index] = event.target.value
    onChange(values)
  }

  @autobind
  handleEntryDelete(index, event) {
    event.preventDefault()

    const { input: { onChange } } = this.props
    const values = this.getValues()

    if (values.length > 1) {
      values.splice(index, 1)
      onChange(values)
    }
  }

  @autobind
  handleBlur() {
    this.props.input.onBlur(this.getValues())
  }

  @autobind
  handleFocus() {
    this.props.input.onFocus(this.getValues())
  }


  @autobind
  renderEntry(value, index) {
    const entryCount = this.getValues().length

    const lastEntry = entryCount <= 1
    const isLast = index === entryCount - 1

    return (
      <div key={index} className={`formEditableList__entry ${lastEntry ? 'formEditableList__entry--new' : ''}`}>
        <div
          className={'entry__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[index] }}
        />
        <input
          type="text"
          className="entry__input fluid"
          value={value}
          placeholder={`${isLast ? 'Add another...' : ''}`}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={e => this.handleEntryChange(index, e)}
        />
        <a className="entry__delete" href="" tabIndex="-1" onClick={e => this.handleEntryDelete(index, e)}>Delete</a>
      </div>
    )
  }

  render() {
    const values = this.getValues()

    return (
      <div className="formEditableList">
        <label className="formEditableList__label">{this.props.label}</label>
        {values.map(this.renderEntry)}
      </div>
    )
  }
}

FormEditableList.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
}

export default FormEditableList
