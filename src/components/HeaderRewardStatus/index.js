import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames/bind'

import Block from 'components/layout/Block'
import Span from 'components/layout/Span'

import * as css from './style.css'

const cx = classNames.bind(css)

class HeaderRewardStatus extends PureComponent {
  async componentDidMount() {
    await this.props.requestMainnetAddress()
  }

  render() {
    const {
      mainnetAddress,
      openSetMainnetAddressModal,
    } = this.props

    const isLoading = mainnetAddress === undefined
    const hasRegistered = parseInt(mainnetAddress, 16) > 0
    const hideRewardStatusInfo = isLoading || hasRegistered

    if (hideRewardStatusInfo) {
      return null
    }

    return (
      <div className={cx('headerReward')}>
        <div className="container">
          <div className={cx('headerRewardStatus')}>
            <i className="icon icon--warning" />
            <span>
              No reward claim address specified yet.&nbsp;
              <Link className={cx('headerReward__link')} to="/scoreboard" href="/scoreboard" onClick={openSetMainnetAddressModal}>Setup claim address</Link>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

HeaderRewardStatus.propTypes = {
  requestMainnetAddress: PropTypes.func.isRequired,
  openSetMainnetAddressModal: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
}

HeaderRewardStatus.defaultProps = {
  mainnetAddress: undefined,
}

export default HeaderRewardStatus
