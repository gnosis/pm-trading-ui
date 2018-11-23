import React from 'react'
import { Trans } from 'react-i18next'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'components/Form'

const DocumentField = ({
  id, type, className, file, t,
}) => (
  <Field name={id} component={Checkbox} className={className}>
    {type === 'TOS_DOCUMENT' && (
      <Trans key="legal.read_and_understood" document={t(`legal.documents.${id}`)}>
        I have read and understood the &nbsp;
        <a href={`${file}`} target="_blank" rel="noopener noreferrer">
          {t(`legal.documents.${id}`)}
        </a>
      </Trans>
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
