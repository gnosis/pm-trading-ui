import React, { Component } from 'react'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'

import Span from 'components/layout/Span'

import { getModerators, generateDeterministicRandomName } from 'utils/helpers'

import * as css from './style.less'

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
    this.setState({ showAddress: !this.state.showAddress })
  }

  getText() {
    const { address } = this.props
    const { showAddress } = this.state

    if (showAddress) {
      return address
    } else if (moderators[address]) {
      return moderators[address]
    }

    return generateDeterministicRandomName(address)
  }

  render() {
    const { showAddress } = this.state

    const text = this.getText()
    return (<Span
      className={cx('walletAddress')}
      onClick={this.onAddressClick}
      title={`${text} (Click to see ${showAddress ? 'address' : 'deterministic name'})`}
    >
      { text }
    </Span>)
  }
}

WalletAddress.propTypes = {
  address: PropTypes.string,
}

export default WalletAddress
