import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { getModerators, generateDeterministicRandomName } from 'utils/helpers'

import './style.less'

const moderators = getModerators()

class WalletAddress extends Component {
  constructor() {
    super()
    this.state = {
      showAddress: false,
    }
  }

  @autobind
  handleOnClick() {
    this.setState({ showAddress: !this.state.showAddress })
  }

  render() {
    const { address } = this.props
    let text

    if (this.state.showAddress) {
      text = address
    } else if (moderators[address]) {
      text = moderators[address]
    } else {
      text = generateDeterministicRandomName(address)
    }

    return <span className="walletAddress" onClick={this.handleOnClick} title="Click to see Address">{ text }</span>
  }
}

WalletAddress.propTypes = {
  address: PropTypes.string,
}

export default WalletAddress
