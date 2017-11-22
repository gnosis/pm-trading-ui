import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import FormInput from 'components/FormInput'
import DeleteOutcome from '../DeleteOutcome'

const Outcome = ({
  onDeleteClick,
  onChange,
  outcomeEntryStyle,
  showDeleteButton = false,
  field,
  index,
  deleteOutcomeLabel,
}) => (
  <div className="formOutcomeList__entry">
    <div className="entry__color" style={outcomeEntryStyle} />
    <Field
      component={FormInput}
      name={field}
      onChange={onChange}
      data-index={index}
      className="formOutcomeListInput"
      placeholder="Add another..."
    />
    {showDeleteButton && <DeleteOutcome onClick={onDeleteClick} text={deleteOutcomeLabel} />}
  </div>
)

Outcome.propTypes = {
  outcomeEntryStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  showDeleteButton: PropTypes.bool,
  field: PropTypes.string,
  index: PropTypes.number,
  deleteOutcomeLabel: PropTypes.string,
  onChange: PropTypes.func,
  onDeleteClick: PropTypes.func,
}

export default Outcome
