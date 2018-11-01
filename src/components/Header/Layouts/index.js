import React from 'react'
import Loadable from 'react-loadable'
import { Desktop, Tablet, Mobile } from 'components/Responsive'
import MobileHeader from './MobileHeader'

const LoadableDesktop = Loadable({
  loader: () => import('./DesktopHeader'),
  loading: () => null,
})

const LoadableMobile = Loadable({
  loader: () => import('./MobileHeader'),
  loading: () => null,
})

const Layout = props => (
  <>
    <Desktop>
      <LoadableDesktop {...props} />
    </Desktop>
    <Tablet>
      <LoadableMobile {...props} />
    </Tablet>
    <Mobile>
      <MobileHeader {...props} />
    </Mobile>
  </>
)

export default Layout
