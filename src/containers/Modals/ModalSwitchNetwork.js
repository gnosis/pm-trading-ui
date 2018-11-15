/* process.env */
import { upperFirst } from 'lodash'

import { connect } from 'react-redux'
import SwitchNetwork from 'components/ModalContent/SwitchNetwork'

import { getTargetNetworkId } from 'api'

import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import { getConfiguration } from 'utils/features'

const { ethereum } = getConfiguration()

const mapStateToProps = () => {
  const targetNetworkId = getTargetNetworkId()

  let targetNetwork
  if (targetNetworkId) {
    targetNetwork = ETHEREUM_NETWORK_IDS[targetNetworkId]
    if (targetNetwork) {
      targetNetwork = upperFirst(targetNetwork.toLowerCase())
    }
  }

  return {
    targetNetwork,
  }
}

export default connect(mapStateToProps)(SwitchNetwork)
