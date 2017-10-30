import { connect } from 'react-redux'
import ConnectWallet from 'components/ConnectWallet'
import { getProviderIcon } from 'containers/HeaderContainer'

const mapStateToProps = () => ({
  getProviderIcon,
})

export default connect(mapStateToProps)(ConnectWallet)
