import React, { Component } from 'react'
import { isArray } from 'lodash'
import autobind from 'autobind-decorator'

import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './formEditableList.less'

class FormEditableKeyValueList extends Component {

  constructor() {
    super()
    this.state = { 'values': [] }
  }

  getValues() {
    const { input } = this.props
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
  handleEntryChange(index, type, event) {
    const { input: { onChange } } = this.props
    let values = this.state.values

    if (type == 'KEY') {
      // KEY
      if (values[index]) {
        values[index][0] = event.target.value
      }
      else {
        values = values.concat([[event.target.value, '']])
      }
    }
    else {
      // VALUE
      values[index][1] = event.target.value
      this.setState({ 'values': values })

      if (values[index]) {
        values[index][1] = event.target.value
      }
      else {
        values = values.concat([['', event.target.value]])
      }

      console.log('Added values: ', values)
    }

    this.setState({ 'values': values })
    onChange(values)

    // execute submit
  }

  @autobind
  handleEntryDelete(index, event) {
    event.preventDefault()
    const { input: { onChange } } = this.props
    const values = this.state.values

    if (values.length > 0) {
      values.splice(index, 1)
      onChange(values)
      this.setState({ 'values': values })
    }

    console.log('Delete values: ', values)
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
    const { input: { onFocus, onBlur } } = this.props

    const entryCount = this.getValues().length

    const lastEntry = entryCount <= 1
    const isLast = index == entryCount - 1

    return (
      <div key={index} className={`formEditableList__entry ${lastEntry ? 'formEditableList__entry--new' : ''}`}>
        <div
          className={'entry__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[index] }}
        />
        <Key
          index={index}
          isLast={isLast}
          onChange={this.handleEntryChange}
          value={value}
        />
        <Value
          index={index}
          isLast={isLast}
          onChange={this.handleEntryChange}
          value={value}
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

class Key extends Component {
  render() {
    const { isLast, index, onChange } = this.props
    return (
      <input
        type="text"
        className="entry__input fluid"
        placeholder={`${isLast ? 'Add another...' : ''}`}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={(e) => { onChange(index, 'KEY', e) }}
      />
    )
  }
}

class Value extends Component {
  render() {
    const { isLast, index, onChange } = this.props
    return (
      <input
        type="text"
        className="entry__input fluid"
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={(e) => { onChange(index, 'VALUE', e) }}
      />
    )
  }
}

export default FormEditableKeyValueList
