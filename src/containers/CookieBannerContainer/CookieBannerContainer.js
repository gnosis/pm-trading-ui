import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import CookieBanner from 'components/CookieBanner'
import { THIRD_PARTY_INTEGRATIONS } from 'utils/analytics'
import { getFeatureConfig } from 'utils/features'

const { options } = getFeatureConfig('cookieBanner')
const ThirdPartyIntegrations = options.map(integration => ({
  ...integration,
  initFunc: THIRD_PARTY_INTEGRATIONS[integration.thirdParty],
}))

class CookieBannerContainer extends Component {
  state = {
    selectedValues: options.map(({ label }) => label),
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
