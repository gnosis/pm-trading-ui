import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'components/Form'

const DocumentField = ({
  id, type, className, file, t,
}) => (
  <Field name={id} component={Checkbox} className={className}>
    {type === 'TOS_DOCUMENT' && (
      <span>
        {t('legal.read_and_understood')}&nbsp;
        <a href={`${file}`} target="_blank" rel="noopener noreferrer">
          {t(`legal.documents.${id}`)}
        </a>
      </span>
    )}
    {type === 'TOS_TEXT' && <span>{t(`legal.documents.${id}_description`)}</span>}
  </Field>
)

DocumentField.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  file: PropTypes.string,
  className: PropTypes.string,
}

DocumentField.defaultProps = {
  className: '',
  file: '',
}

export default DocumentField
