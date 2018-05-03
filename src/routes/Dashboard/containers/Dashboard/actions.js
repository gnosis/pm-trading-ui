import { push } from 'react-router-redux'
import { fetchMarkets } from 'store/actions/market'

export default dispatch => ({
  fetchMarkets: () => dispatch(fetchMarkets()),
  viewMarket: address => dispatch(push(`/markets/${address}`)),
})
