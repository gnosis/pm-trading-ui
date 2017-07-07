import React from 'react'
import { Field } from 'redux-form'

import OutcomeCategorical from 'components/OutcomeCategorical'
import OutcomeScalar from 'components/OutcomeScalar'

import { OUTCOME_TYPES } from 'utils/constants'


import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'

const SectionOutcomeSelection = () => {
  const outcomeTypeLabels = {
    [OUTCOME_TYPES.CATEGORICAL]: 'Categorical Outcome',
    [OUTCOME_TYPES.SCALAR]: 'Scalar Outcome',
  }

  const outcomeSections = {
    [OUTCOME_TYPES.CATEGORICAL]: <OutcomeCategorical />,
    [OUTCOME_TYPES.SCALAR]: <OutcomeScalar />,
  }

  return (
    <div className="sectionOutcomeSelection">
      <FormRadioButtonLabel label="Outcome Type" />
      {Object.keys(outcomeTypeLabels).map(fieldValue =>
        <Field key={fieldValue} name="outcomeType" component={FormRadioButton} radioValue={fieldValue} text={outcomeTypeLabels[fieldValue]} />,
        )}
    </div>
  )
}

export default SectionOutcomeSelection
