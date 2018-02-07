import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'
import addMarkets from './addMarkets'

// TODO The default assignment is because JEST test do not work out of the box
// with ENV variables. Fix that using the plugin dotenv(for example)
const whitelisted = process.env.WHITELIST || {}
const addresses = Object.keys(whitelisted).map(address => hexWithoutPrefix(address))

export default () => dispatch =>
  requestFromRestAPI('markets', { creator: addresses.join() })
    .then((response) => {
      if (!response) {
        dispatch(addMarkets([]))
      }

      dispatch(addMarkets(response.results))
    })
