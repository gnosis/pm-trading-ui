import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'

import FormInput from 'components/FormInput'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './formOutcomeList.less'

class FormOutcomeList extends Component {
  addOutcome = () => this.props.fields.push('')

  addOutcomeOnChange = (event) => {
    const { fields } = this.props
    const { target } = event
    const { value } = target
    const index = +target.getAttribute('data-index')
    if (index === fields.length - 1 && value != null && value.length > 0) {
      fields.push('')
    }
  }

  removeOutcome = (event) => {
    event.preventDefault()
    const { fields } = this.props
    const index = event.target.getAttribute('data-index')
    fields.remove(index)
  }

  render() {
    const { fields, label, meta: { error, invalid } } = this.props
    return (
      <div className="formOutcomeList">
        <label htmlFor="outcomes" className="formOutcomeList__label">
          {label}
        </label>
        {fields.map((field, index) => (
          <div key={index} className={'formOutcomeList__entry'}>
            <div className={'entry__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[index] }} />
            <Field
              component={FormInput}
              name={`${field}`}
              onChange={this.addOutcomeOnChange}
              data-index={index}
              className="formOutcomeListInput"
              placeholder="Add another..."
            />
            {fields.length > 2 && (
              <a className="entry__delete" href="" tabIndex="-1" data-index={index} onClick={this.removeOutcome}>
                Delete
              </a>
            )}
          </div>
        ))}
        <a className="entry__add" onClick={this.addOutcome}>
          Add
        </a>
        {invalid && error && <span>{error}</span>}
      </div>
    )
  }
}

FormOutcomeList.propTypes = {
  fields: PropTypes.shape({
    push: PropTypes.func,
    remove: PropTypes.func,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  label: PropTypes.string,
}

export default FormOutcomeList
