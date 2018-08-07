import Loadable from 'react-loadable'

const LoadableScoreboard = Loadable({
  loader: () => import('./MarketDetailPage'),
  loading: () => null,
})

export default LoadableScoreboard
