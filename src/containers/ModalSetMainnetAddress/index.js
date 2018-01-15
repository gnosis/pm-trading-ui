import { connect } from 'react-redux'

import { closeModal } from 'actions/modal'
import { updateMainnetAddress, requestMainnetAddress } from 'actions/blockchain'

import SetMainnetAddress from 'components/SetMainnetAddress'

export default connect(null, {
  updateMainnetAddress,
  requestMainnetAddress,
  closeModal,
})(SetMainnetAddress)
