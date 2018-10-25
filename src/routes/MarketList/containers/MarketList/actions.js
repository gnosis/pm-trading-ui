import { fetchMarkets } from 'store/actions/market'

export default dispatch => ({
  fetchMarkets: () => dispatch(fetchMarkets()),
})
