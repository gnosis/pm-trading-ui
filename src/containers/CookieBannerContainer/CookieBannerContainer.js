import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import CookieBanner from 'components/CookieBanner'
import { getUiState } from 'store/selectors/interface'
import { THIRD_PARTY_INTEGRATIONS } from 'utils/analytics'
import { getFeatureConfig } from 'utils/features'
import { changeUiState } from 'store/actions/interface'

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
    const { selectedValues } = this.state
    const { changeIntercomVisibility, showCookieBanner, hideCookieBanner } = this.props

    return (
      <CookieBanner
        display={showCookieBanner}
        options={ThirdPartyIntegrations}
        onChange={this.onChange}
        onHide={hideCookieBanner}
        selected={selectedValues}
        changeIntercomVisibility={changeIntercomVisibility}
      />
    )
  }
}

CookieBannerContainer.propTypes = {
  changeIntercomVisibility: PropTypes.func.isRequired,
  hideCookieBanner: PropTypes.func.isRequired,
  showCookieBanner: PropTypes.bool,
}

CookieBannerContainer.defaultProps = {
  showCookieBanner: false,
}

const mapStateToProps = state => ({
  showCookieBanner: getUiState(state, 'showCookieBanner'),
})

const mapDispatchToProps = dispatch => ({
  hideCookieBanner: () => dispatch(changeUiState({ showCookieBanner: false })),
  changeIntercomVisibility: isVisible => dispatch(changeUiState({ showIntercomReminder: isVisible })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CookieBannerContainer)
