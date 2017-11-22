import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'
import FormInput from 'components/FormInput'
import DeleteOutcome from '../DeleteOutcome'

const Outcome = ({
  onDeleteClick,
  onChange,
  showDelete,
  field,
  index,
  deleteLabel,
}) => {
  const outcomeEntryStyle = {
    backgroundColor: COLOR_SCHEME_DEFAULT[index],
  }

  return (<div className="formOutcomeList__entry">
    <div className="entry__color" style={outcomeEntryStyle} />
    <Field
      component={FormInput}
      name={field}
      onChange={onChange}
      data-index={index}
      className="formOutcomeListInput"
      placeholder="Add another..."
    />
    {showDelete && <DeleteOutcome onClick={onDeleteClick} text={deleteLabel} />}
  </div>)
}

Outcome.propTypes = {
  showDelete: PropTypes.bool,
  field: PropTypes.string,
  index: PropTypes.number,
  deleteLabel: PropTypes.string,
  onChange: PropTypes.func,
  onDeleteClick: PropTypes.func,
}

export default Outcome
