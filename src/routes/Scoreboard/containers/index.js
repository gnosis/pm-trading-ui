import Loadable from 'react-loadable'

const LoadableScoreboard = Loadable({
  loader: () => import('./ScoreBoard'),
  loading: () => null,
})

export default LoadableScoreboard
