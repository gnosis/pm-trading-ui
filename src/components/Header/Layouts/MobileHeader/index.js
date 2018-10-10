import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cn from 'classnames/bind'
import Balance from 'components/Header/Balance'
import Hairline from 'components/layout/Hairline'
import Identicon from 'components/Header/Identicon'

import CopyIcon from './assets/icon_copy.svg'
import BurgerIcon from './BurgerIcon'
import style from './MobileHeader.scss'
import './BurgerMenuStyles.scss?raw'

const cx = cn.bind(style)

const HairlineStyle = {
  width: '100%',
  height: '2px',
  backgroundColor: '#f0f1f1',
  marginBottom: '15px',
  marginTop: '5px',
}

const copyIconStyle = {
  width: 15,
  height: 15,
  marginLeft: 5,
}

const formatAddress = address => `${address.slice(0, 10)}...${address.slice(35)}`

class MobileHeader extends Component {
  copyAddress = () => {
    const { currentAccount } = this.props
    if (!navigator.clipboard) {
      return
    }

    // navigator.clipboard works only for websites server via HTTPS, so it won't work on the dev build
    try {
      navigator.clipboard.writeText(currentAccount)
    } catch (err) {
      console.error(err.message)
    }
  }

  render() {
    const {
      logoVars,
      canInteract,
      showScoreboard,
      showGameGuide,
      gameGuideType,
      gameGuideURL,
      currentAccount,
      etherBalance,
      tokenBalance,
      tokenSymbol,
      tokenBalanceIsWrappedEther,
      currentNetwork,
    } = this.props
    return (
      <div className={cx('headerMobileContainer')}>
        <div className={cx('logo')}>
          <NavLink to="/markets/list">
            <div className={cx('headerLogo', 'beta')} style={logoVars} />
          </NavLink>
        </div>
        <Menu right customBurgerIcon={<BurgerIcon />}>
          <div className={cx('overviewContainer')}>
            <div className={cx('networkBalanceWrapper')}>
              <span className={cx('network')}>{currentNetwork}</span>
              <Balance
                etherBalance={etherBalance}
                tokenBalance={tokenBalance}
                tokenSymbol={tokenSymbol}
                isWrappedEther={tokenBalanceIsWrappedEther}
              />
            </div>
            <Identicon account={currentAccount} className={cx('identicon')} />
            <div className={cx('addressWrapper')}>
              <button type="button" className={cx('address')} onClick={this.copyAddress}>
                {formatAddress(currentAccount)}
              </button>
              <img src={CopyIcon} style={copyIconStyle} alt="Click to copy" />
            </div>
          </div>
          <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink', 'bm-item')}>
            Markets
          </NavLink>
          <Hairline style={HairlineStyle} />
          {canInteract && (
            <>
              <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink', 'bm-item')}>
                Dashboard
              </NavLink>
              <Hairline style={HairlineStyle} />
            </>
          )}
          {showScoreboard && (
            <>
              <NavLink to="/scoreboard" activeClassName={cx('active')} className={cx('navLink', 'bm-item')}>
                Scoreboard
              </NavLink>
              <Hairline style={HairlineStyle} />
            </>
          )}
          {showGameGuide && (
            <>
              {gameGuideType === 'default' ? (
                <>
                  <NavLink to="/game-guide" activeClassName={cx('active')} className={cx('navLink', 'bm-item')}>
                    Game guide
                  </NavLink>
                  <Hairline style={HairlineStyle} />
                </>
              ) : null}
              {gameGuideType === 'link' ? (
                <>
                  <a href={gameGuideURL} className={cx('navLink', 'bm-item')} target="_blank" rel="noopener noreferrer">
                    Game Guide
                  </a>
                  <Hairline style={HairlineStyle} />
                </>
              ) : null}
            </>
          )}
        </Menu>
      </div>
    )
  }
}

MobileHeader.propTypes = {
  currentAccount: PropTypes.string,
  showGameGuide: PropTypes.bool,
  showScoreboard: PropTypes.bool,
  canInteract: PropTypes.bool.isRequired,
  logoVars: PropTypes.shape({
    '--logoPath': PropTypes.string,
    '-smallLogoPath': PropTypes.string,
  }).isRequired,
  tokenBalanceIsWrappedEther: PropTypes.bool.isRequired,
}

MobileHeader.defaultProps = {
  currentAccount: undefined,
  showGameGuide: false,
  showScoreboard: false,
}

export default MobileHeader
