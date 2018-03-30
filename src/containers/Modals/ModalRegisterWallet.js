import RegisterWallet from 'components/ModalContent/RegisterWallet'
import { connect } from 'react-redux'
import { getCurrentAccount, getCurrentBalance } from 'integrations/store/selectors'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
})

export default connect(mapStateToProps, null)(RegisterWallet)
