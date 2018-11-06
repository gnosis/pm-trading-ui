import Loadable from 'react-loadable'

const LoadableMarketList = Loadable({
  loader: () => import('./MarketList'),
  loading: () => null,
})

export default LoadableMarketList
