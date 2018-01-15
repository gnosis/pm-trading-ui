import { connect } from 'react-redux'
import { openModal, closeModal } from 'actions/modal'

import { checkWalletConnection } from 'selectors/blockchain'

import {
  olympiaMainnetRegistryAddress,
} from 'routes/scoreboard/store/selectors'
import {
  requestMainnetAddress,
  updateMainnetAddress,
} from 'routes/scoreboard/store/actions/mainnetRegistry'

import HeaderRewardStatus from 'components/HeaderRewardStatus'

const mapStateToProps = state => ({
  mainnetAddress: olympiaMainnetRegistryAddress(state),
  hasWallet: checkWalletConnection(state),
})

const mapDispatchToProps = dispatch => ({
  updateMainnetAddress: mainnetAddress => dispatch(updateMainnetAddress(mainnetAddress)),
  requestMainnetAddress: () => dispatch(requestMainnetAddress()),
  openSetMainnetAddressModal: () => dispatch(openModal({ modalName: 'ModalSetMainnetAddress' })),
  closeModal: () => dispatch(closeModal()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderRewardStatus)
