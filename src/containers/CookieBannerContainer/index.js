import React, { Component } from 'react'
import CookieBanner from 'components/CookieBanner'

const ThirdPartyIntegrations = [
  {
    label: 'Chat support',
    initFunc: () => {},
  },
  {
    label: 'Analytics',
    initFunc: () => {},
  },
]

class CookieBannerContainer extends Component {
  state = {
    selectedValues: ['Chat support', 'Analytics'],
    showBanner: false,
  }

  componentDidMount() {}

  render() {
    const { selectedValues, showBanner } = this.state

    return <CookieBanner display={showBanner} options={ThirdPartyIntegrations} selected={selectedValues} />
  }
}

export default CookieBannerContainer
