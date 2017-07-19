import { connect } from 'react-redux'
import { reduxForm, formValueSelector, submit } from 'redux-form'
import { push } from 'react-router-redux'
import moment from 'moment'

import MarketCreateReview from 'components/MarketCreateReview'

import { composeMarket } from 'actions/market'

const FORM = {
  form: 'marketCreateWizard',
  onSubmit: (values, dispatch, props) => {
    const { formValues: { resolutionDate, ...market } } = props

    market.resolutionDate = moment(props.formValues.resolutionDate)

    return dispatch(composeMarket(market))
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('marketCreateWizard')
  return {
    formValues: {
      oracleType: 'CENTRALIZED', //selector(state, 'oracleType'),
      collateralToken: 'ETH', //selector(state, 'collateralToken'),
      fee: 1.422, //selector(state, 'fee'),
      funding: 2.21, //selector(state, 'funding'),
      title: "This is a testmarket!", //selector(state, 'title'),
      description: "Lorem Ipsum dolor sit amet bla blabl alba bla test foo bar test bla blu bleh", //selector(state, 'description'),
      resolutionDate: "2019-09-09 09:00:00", //selector(state, 'resolutionDate'),
      ultimateOracle: false, //selector(state, 'ultimateOracle'),
      outcomeType: 'CATEGORICAL', //selector(state, 'outcomeType'),
      outcomes: ['This is a', 'Test'], // selector(state, 'outcomes'),
      upperBound: selector(state, 'upperBound'),
      lowerBound: selector(state, 'lowerBound'),
      decimals: selector(state, 'decimals'),
      unit: selector(state, 'unit'),
    }
  }
}

const mapDispatchToProps = dispatch => ({
  createMarket: market => dispatch(composeMarket(market)),
  changeUrl: url => dispatch(push(url)),
  submitForm: () => dispatch(submit('marketCreateWizard')),
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(MarketCreateReview))
