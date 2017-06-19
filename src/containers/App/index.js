import React from 'react'

import HeaderContainer from 'containers/HeaderContainer'

import './app.less'

export default ({ children }) => (
  <div className="appContainer container">
    <HeaderContainer />
    {children}
  </div>
)
