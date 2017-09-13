import { connect } from 'react-redux'
import { reduxForm, formValueSelector, reset } from 'redux-form'
import { push } from 'react-router-redux'
import moment from 'moment'
import uuid from 'uuid/v4'

import MarketCreateReview from 'components/MarketCreateReview'

import { createMarket } from 'actions/market'
import { openModal } from 'actions/modal'

const submitAction = (formValues) => async (dispatch) => {
  dispatch(reset('marketCreateWizard'))
  // build models
  const eventDescription = {
    description: formValues.description,
    title: formValues.title,
    resolutionDate: moment(formValues.resolutionDate).format(),
    decimals: formValues.decimals,
    unit: formValues.unit,
    outcomes: formValues.outcomes,
  }

  const oracle = {
    eventDescription: undefined,
    type: formValues.oracleType,
    // TODO: Add for Ultimate Oracle
  }

  const event = {
    oracle: undefined,
    collateralToken: undefined,
    type: formValues.outcomeType,
    decimals: formValues.decimals || 0,
    lowerBound: formValues.lowerBound,
    upperBound: formValues.upperBound,
  }

  const market = {
    event: undefined,
    fee: formValues.fee,
    funding: formValues.funding,
  }

  const transactionLogId = uuid()
  await dispatch(openModal({ modalName: 'ModalMarketProgress', transactionId: transactionLogId }))

  try {
    await dispatch(createMarket({
      eventDescription,
      oracle,
      event,
      market,
      transactionId: transactionLogId,
    }))

    dispatch(push('markets/list'))
  } catch (e) {
    console.error(e)
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('marketCreateWizard')
  return {
    formValues: {
      oracleType: selector(state, 'oracleType'),
      collateralToken: selector(state, 'collateralToken'),
      fee: selector(state, 'fee'),
      funding: selector(state, 'funding'),
      title: selector(state, 'title'),
      description: selector(state, 'description'),
      resolutionDate: selector(state, 'resolutionDate'),
      ultimateOracle: selector(state, 'ultimateOracle'),
      outcomeType: selector(state, 'outcomeType'),
      outcomes: selector(state, 'outcomes'),
      upperBound: selector(state, 'upperBound'),
      lowerBound: selector(state, 'lowerBound'),
      decimals: selector(state, 'decimals'),
      unit: selector(state, 'unit'),
    },
  }
}

const mapDispatchToProps = dispatch => ({
  changeUrl: url => dispatch(push(url)),
  submitForm: formvalues => dispatch(submitAction(formvalues)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketCreateReview)
