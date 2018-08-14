import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import CookieBanner from 'components/CookieBanner'
import loadGoogleAnalytics from 'utils/analytics/google'
import loadIntercom from 'utils/analytics/intercom'

const ThirdPartyIntegrations = [
  {
    label: 'Chat support',
    initFunc: loadGoogleAnalytics,
  },
  {
    label: 'Analytics',
    initFunc: loadIntercom,
  },
]

class CookieBannerContainer extends Component {
  state = {
    selectedValues: ['Chat support', 'Analytics'],
  }

  @autobind
  onChange(value) {
    const { selectedValues } = this.state

    const newSelectedValues = [...selectedValues]
    const valueIndex = newSelectedValues.indexOf(value)

    if (valueIndex > -1) {
      newSelectedValues.splice(valueIndex, 1)
    } else {
      newSelectedValues.push(value)
    }

    this.setState({
      selectedValues: newSelectedValues,
    })
  }

  render() {
    const { selectedValues, showBanner } = this.state

    return (
      <CookieBanner
        display={showBanner}
        options={ThirdPartyIntegrations}
        onChange={this.onChange}
        selected={selectedValues}
      />
    )
  }
}

export default CookieBannerContainer
