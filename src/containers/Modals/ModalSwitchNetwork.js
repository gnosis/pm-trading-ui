/* process.env */
import { upperFirst } from 'lodash'

import { connect } from 'react-redux'
import SwitchNetwork from 'components/ModalContent/SwitchNetwork'

import { getTargetNetworkId } from 'integrations/store/selectors'

import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'

const mapStateToProps = (state) => {
  const { config: { ethereum } } = process.env.CONFIG

  const targetNetworkURL = `${ethereum.protocol}://${ethereum.host}`
  const targetNetworkId = getTargetNetworkId(state)

  let targetNetwork
  if (targetNetworkId) {
    targetNetwork = ETHEREUM_NETWORK_IDS[targetNetworkId]
    if (targetNetwork) {
      targetNetwork = upperFirst(targetNetwork.toLowerCase())
    }
  }

  return {
    targetNetwork,
    targetNetworkURL,
  }
}

export default connect(mapStateToProps)(SwitchNetwork)
