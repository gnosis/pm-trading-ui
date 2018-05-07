import RegisterWallet from 'components/ModalContent/RegisterWallet'
import { updateMainnetAddress } from 'actions/account'
import { requestGasPrice } from 'actions/blockchain'
import { connect } from 'react-redux'
import { getCurrentAccount, getCurrentBalance } from 'integrations/store/selectors'
import { getGasPrice } from 'routes/MarketDetails/store/selectors'
import { formValueSelector } from 'redux-form'
import { requestRegistrationGasCost } from './actions'
import { getRegistrationGasCost } from './selectors'

const getFormValue = formValueSelector('tosAgreement')

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  registrationGasCost: getRegistrationGasCost(state),
  gasPrice: getGasPrice(state),
  tosAgreed: !!getFormValue(state, 'agreedWithTOS'),
  ppAgreed: !!getFormValue(state, 'agreedWithPP'),
  rdAgreed: !!getFormValue(state, 'agreedWithRDP'),
})

const mapDispatchToProps = dispatch => ({
  updateMainnetAddress: account => dispatch(updateMainnetAddress(account)),
  requestRegistrationGasCost: () => dispatch(requestRegistrationGasCost()),
  requestGasPrice: () => dispatch(requestGasPrice()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWallet)
