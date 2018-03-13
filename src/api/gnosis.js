import Gnosis from '@gnosis.pm/gnosisjs/'
import { NETWORK_TIMEOUT } from 'actions/blockchain'

let gnosisInstance

export const {
  calcLMSRCost, calcLMSROutcomeTokenCount, calcLMSRMarginalPrice, calcLMSRProfit,
} = Gnosis

/**
 * Initializes connection to GnosisJS
 * @param {*dictionary} GNOSIS_OPTIONS
 */
export const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  try {
    gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)

    if (process.env.NODE_ENV === 'development') {
      window.gnosis = gnosisInstance
    }

    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
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

  return new Promise((resolve, reject) => {
    let stillRunning = true
    const instanceCheck = setInterval(() => {
      if (gnosisInstance) {
        stillRunning = false
        clearInterval(instanceCheck)
        return resolve(gnosisInstance)
      }
    }, 50)

    setTimeout(() => {
      if (stillRunning) {
        clearInterval(instanceCheck)
        reject(new Error('Connection to Gnosis.js timed out'))
      }
    }, NETWORK_TIMEOUT)
  })
}
