import React, { Component } from 'react'
import { Field } from 'redux-form'

import { ORACLE_TYPES, OUTCOME_TYPES } from 'utils/constants'
import './marketCreateWizard.less'

import GroupCentralizedOracle from 'components/GroupCentralizedOracle'
import GroupBlockDifficulty from 'components/GroupBlockDifficulty'
import GroupOutcomeSelection from 'components/GroupOutcomeSelection'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'

export default class MarketCreateWizard extends Component {
  render() {
    return (
      <div className="marketCreateWizardPage">
        <div className="marketCreateWizardPage__header">
          <div className="container">
            <h1>Create Market</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {this.renderForm()}
            </div>
            <div className="col-md-4">
              {this.renderFormProgress()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderFormOracle() {
    const { selectedOracleType, selectedOutcomeType } = this.props
    const oracleSections = {
      [ORACLE_TYPES.CENTRALIZED]:
        <GroupCentralizedOracle selectedOutcomeType={selectedOutcomeType} />,
      [ORACLE_TYPES.BLOCK_DIFFICULTY]:
        <GroupBlockDifficulty />,
    }

    return oracleSections[selectedOracleType]
  }

  renderForm() {
    const oracleValueLabels = {
      [ORACLE_TYPES.CENTRALIZED]: 'Centralized Oracle',
      [ORACLE_TYPES.BLOCK_DIFFICULTY]: 'Block Difficulty',
    }


    return (
      <form>
        <div className="row">
          <div className="col-md-2">
            <div className="marketWizardHeading marketWizardHeading__number">1</div>
          </div>
          <div className="col-md-10">
            <h2 className="marketWizardHeading marketWizardHeading__title">Event Details</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <FormRadioButtonLabel label="Oracle Type" />
            {Object.keys(oracleValueLabels).map(fieldValue =>
              <Field key={fieldValue} name="oracleType" component={FormRadioButton} radioValue={fieldValue} text={oracleValueLabels[fieldValue]} />
            )}
          </div>
        </div>
        {this.renderFormOracle()}
      </form>
    )
  }

  renderFormProgress() {
    return (
      <h1>Hi</h1>
    )
  }
}
