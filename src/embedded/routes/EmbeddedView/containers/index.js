import { withRouter } from 'react-router-dom'
import {
  lifecycle, compose, withStateHandlers, withHandlers,
} from 'recompose'
import EmbeddedViewComponent from '../components'

import { getMarketById } from '../api'

const enhancer = compose(
  withRouter,
  withStateHandlers(
    { requestStatus: 'UNKNOWN', market: undefined },
    {
      setRequestStatus: () => newStatus => ({ requestStatus: newStatus }),
      setMarket: () => market => ({ market }),
    },
  ),
  withHandlers({
    fetchMarket: ({
      match: { params: { address } },
      setRequestStatus,
      setMarket,
    }) => async () => {
      setRequestStatus('PENDING')
      try {
        const market = await getMarketById(address)
        setMarket(market)
        setRequestStatus('SUCCESS')
      } catch (err) {
        setRequestStatus('ERROR')
        console.error(`Gnosis Market Fetch failed: ${err.message}`)
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchMarket()
    },
  }),
)

export default enhancer(EmbeddedViewComponent)
