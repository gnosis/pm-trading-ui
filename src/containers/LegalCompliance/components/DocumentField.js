import React from 'react'

import { Field } from 'redux-form'
import { Checkbox } from 'components/Form'

const DocumentField = ({
  id, type, title, text, className,
}) => (
  <Field name={id} component={Checkbox} className={className}>
    {type === 'TOS_DOCUMENT' && (
      <span>
        I have read and understood the
        {title}
      </span>
    )}
    {type === 'TOS_TEXT' && <span>{text}</span>}
  </Field>
)

export default DocumentField
