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
  }

  componentDidMount() {}

  render() {
    const { selectedValues } = this.state

    return <CookieBanner options={ThirdPartyIntegrations} selected={selectedValues} />
  }
}

export default CookieBannerContainer
