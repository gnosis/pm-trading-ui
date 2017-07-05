import React, { Component } from 'react'

import { getColorForIndex } from 'utils/helpers'

class FormEditableList extends Component {
  getValues() {
    const { input } = this.props

    if (typeof input.value.length !== 'undefined') {
      return input.value
    }

    return []
  }

  renderEntry(value, index) {
    <div className="formEditableList__entry">
      <div
        className="entry__color"
        style={{ backgroundColor: getColorForIndex(index) }}
      />
      <input type="text" className="entry__input" value={value} />
    </div>
  }

  renderLastEntry(index) {

  }

  render() {
    const values = this.getValues()

    return (
      <div className="formEditableList">
        {values.map(this.renderEntry)}
        {this.renderLastEntry(values.length - 1)}
      </div>
    )
  }
}

export default FormEditableList
