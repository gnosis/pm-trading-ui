import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'components/Form'

const DocumentField = ({
  id, type, title, text, className, file,
}) => (
  <Field name={id} component={Checkbox} className={className}>
    {type === 'TOS_DOCUMENT' && (
      <span>
        I have read and understood the{' '}
        <a href={`${file}`} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </span>
    )}
    {type === 'TOS_TEXT' && <span>{text}</span>}
  </Field>
)

DocumentField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  file: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
}

DocumentField.defaultProps = {
  className: '',
  title: '',
  file: '',
  text: '',
}

export default DocumentField
