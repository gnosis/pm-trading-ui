import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'

import Span from 'components/layout/Span'

import { getModerators, generateWalletName } from 'utils/helpers'

import * as css from './style.scss'

const cx = classNames.bind(css)

const moderators = getModerators()

class WalletAddress extends Component {
  constructor() {
    super()
    this.state = {
      showAddress: false,
    }
  }

  onAddressClick = () => {
    this.setState(() => ({ showAddress: !this.state.showAddress }))
  }

  getText() {
    const { address } = this.props
    const { showAddress } = this.state

    if (showAddress) {
      return address
    }

    if (moderators[address]) {
      return moderators[address]
    }

    return generateWalletName(address)
  }

  render() {
    const { showAddress } = this.state

    const changeToVarText = showAddress ? 'deterministic' : 'address'
    const text = this.getText()
    return (
      <Span
        className={cx('walletAddress')}
        onClick={this.onAddressClick}
        title={t('wallet_display_type', { text, otherType: changeToVarText })}
      >
        {text}
      </Span>
    )
  }
}

WalletAddress.propTypes = {
  t: PropTypes.func.isRequired,
  address: PropTypes.string,
}

export default withNamespaces()(WalletAddress)
