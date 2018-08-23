import Loadable from 'react-loadable'

const LoadableCookieBanner = Loadable({
  loader: () => import('./CookieBannerContainer'),
  loading: () => null,
})

export default LoadableCookieBanner
