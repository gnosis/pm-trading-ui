import Gnosis from '@gnosis.pm/pm-js'
import apolloArtifacts from '@gnosis.pm/pm-apollo-contracts'
import { NETWORK_TIMEOUT } from 'store/actions/blockchain'
import { isFeatureEnabled } from 'utils/features'

const tournamentEnabled = isFeatureEnabled('tournament')

let gnosisInstance
let gnosisROInstance

export const {
  calcLMSRCost, calcLMSROutcomeTokenCount, calcLMSRMarginalPrice, calcLMSRProfit,
} = Gnosis

const addApolloContracts = async (gnosisJsInstance) => {
  await gnosisJsInstance.importContracts(apolloArtifacts, {
    OlympiaToken: 'olympiaToken',
    AddressRegistry: 'olympiaAddressRegistry',
    RewardClaimHandler: 'rewardClaimHandler',
  })
}

const waitForGnosisConnection = instance => new Promise((resolve, reject) => {
  let stillRunning = true
  const instanceCheck = setInterval(() => {
    if (instance) {
      stillRunning = false
      clearInterval(instanceCheck)
      return resolve(instance)
    }
  }, 50)

  setTimeout(() => {
    if (stillRunning) {
      clearInterval(instanceCheck)
      reject(new Error('Connection to RO pm-js timed out'))
    }
  }, NETWORK_TIMEOUT)
})

/**
 * Initializes connection to GnosisJS
 * @param {*dictionary} GNOSIS_OPTIONS
 */
export const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  if (gnosisInstance) return

  try {
    const gnosis = await Gnosis.create(GNOSIS_OPTIONS)

    if (tournamentEnabled) {
      await addApolloContracts(gnosis)
    }

    gnosisInstance = gnosis

    if (process.env.NODE_ENV === 'development') {
      window.gnosis = gnosisInstance
    }

    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

export const initReadOnlyGnosisConnection = async (GNOSIS_OPTIONS) => {
  if (gnosisROInstance) return

  try {
    const gnosis = await Gnosis.create(GNOSIS_OPTIONS)

    if (tournamentEnabled) {
      await addApolloContracts(gnosis)
    }

    gnosisROInstance = gnosis

    if (process.env.NODE_ENV === 'development') {
      window.gnosisRO = gnosisROInstance
    }

    console.info('Gnosis RO Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis RO Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

/**
 * Returns an instance of the connection to GnosisJS
 */
export const getGnosisConnection = async () => {
  if (gnosisInstance) {
    return gnosisInstance
  }

  return waitForGnosisConnection(gnosisInstance)
}

export const getROGnosisConnection = async () => {
  if (gnosisROInstance) {
    return gnosisROInstance
  }

  return waitForGnosisConnection(gnosisROInstance)
}

export const getROGnosisNetworkId = () => new Promise(async (resolve, reject) => {
  const gnosisRO = await getROGnosisConnection()

  gnosisRO.web3.version.getNetwork((err, network) => {
    if (err) {
      reject(err)
    }

    resolve(network)
  })
})

export default Gnosis
