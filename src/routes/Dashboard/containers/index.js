import Loadable from 'react-loadable'

const LoadableDashboard = Loadable({
  loader: () => import('./Dashboard'),
  loading: () => null,
})

export default LoadableDashboard
