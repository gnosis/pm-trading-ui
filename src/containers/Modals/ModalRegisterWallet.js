import RegisterWallet from 'components/ModalContent/RegisterWallet'
import { updateMainnetAddress } from 'actions/account'
import { connect } from 'react-redux'
import { getCurrentAccount, getCurrentBalance } from 'integrations/store/selectors'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
})

const mapDispatchToProps = dispatch => ({ updateMainnetAddress: account => dispatch(updateMainnetAddress(account)) })

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWallet)
