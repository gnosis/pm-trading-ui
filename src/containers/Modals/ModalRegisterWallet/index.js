import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import RegisterWallet from 'components/ModalContent/RegisterWallet'

import { updateMainnetAddress } from 'store/actions/account'
import { requestGasPrice } from 'store/actions/blockchain'
import { getCollateralToken } from 'store/selectors/blockchain'
import { getCurrentAccount, getCurrentBalance } from 'integrations/store/selectors'
import { setLegalDocumentsAccepted } from 'integrations/store/actions'
import { getGasPrice } from 'routes/MarketDetails/store/selectors'
import { requestRegistrationGasCost } from './actions'
import { getRegistrationGasCost } from './selectors'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  registrationGasCost: getRegistrationGasCost(state),
  gasPrice: getGasPrice(state),
  collateralToken: getCollateralToken(state),
})

const mapDispatchToProps = {
  setLegalDocumentsAccepted,
  updateMainnetAddress,
  requestRegistrationGasCost,
  requestGasPrice,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWallet)
