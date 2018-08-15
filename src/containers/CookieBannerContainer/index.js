import Loadable from 'react-loadable'

const LoadableDashboard = Loadable({
  loader: () => import('./CookieBannerContainer'),
  loading: () => null,
})

export default LoadableDashboard
