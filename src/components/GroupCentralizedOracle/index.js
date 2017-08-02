import React from 'react'

import { OUTCOME_TYPES } from 'utils/constants'

import SectionDescription from 'components/SectionDescription'
import SectionEventOptions from 'components/SectionEventOptions'
import SectionOutcomeSelection from 'components/SectionOutcomeSelection'

import OutcomeCategorical from 'components/OutcomeCategorical'
import OutcomeScalar from 'components/OutcomeScalar'

const OracleCentralized = ({ selectedOutcomeType }) => {
  const renderOutcomeType = () => {
    const outcomeSections = {
      [OUTCOME_TYPES.CATEGORICAL]: <OutcomeCategorical />,
      [OUTCOME_TYPES.SCALAR]: <OutcomeScalar />,
    }

    return outcomeSections[selectedOutcomeType]
  }


  return (
    <div className="oracleCentralized">
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionDescription
            canEditTitle
            canEditDescription
            canEditResolutionDate
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionEventOptions />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          <SectionOutcomeSelection />
        </div>
      </div>
      <div className="row">
        <div className="col-md-offset-2 col-md-10">
          {renderOutcomeType()}
        </div>
      </div>
    </div>
  )
}

export default OracleCentralized
