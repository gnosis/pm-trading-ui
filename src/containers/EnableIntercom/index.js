import Loadable from 'react-loadable'

const LoadableEnableIntercom = Loadable({
  loader: () => import('./EnableIntercomContainer'),
  loading: () => null,
})

export default LoadableEnableIntercom
