import React from 'react'
import Loadable from 'react-loadable'
import { Desktop, Tablet, Mobile } from 'components/Responsive'

const LoadableDesktop = Loadable({
  loader: () => import('./DesktopHeader'),
  loading: () => null,
})

const LoadableMobile = Loadable({
  loader: () => import('./MobileHeader'),
  loading: () => null,
})

const Layout = props => (
  <div>
    <Desktop {...props}>
      <LoadableDesktop />
    </Desktop>
    <Tablet {...props}>
      <LoadableMobile />
    </Tablet>
    <Mobile {...props}>
      <LoadableMobile />
    </Mobile>
  </div>
)

export default Layout
