import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cn from 'classnames/bind'
import Hairline from 'components/layout/Hairline'
import AccountOverview from './AccountOverview'

import BurgerIcon from './BurgerIcon'
import style from './MobileHeader.scss'

import('components/Header/Layouts/MobileHeader/BurgerMenuStyles.scss?raw')

const cx = cn.bind(style)

const HairlineStyle = {
  width: '100%',
  height: '2px',
  backgroundColor: '#f0f1f1',
  marginBottom: '15px',
  marginTop: '5px',
}

class MobileHeader extends Component {
  state = {
    menuOpen: false,
  }

  handleStateChange = (state) => {
    this.setState({ menuOpen: state.isOpen })
  }

  closeMenu = () => {
    this.setState({ menuOpen: false })
  }

  connectWalletClick = () => {
    const { handleConnectWalletClick } = this.props
    this.closeMenu()

    handleConnectWalletClick()
  }

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
      modal,
      t,
    } = this.props
    const { menuOpen } = this.state

    const isModalOpen = modal.get('isOpen', false)
    const onStateChangeHandler = state => this.handleStateChange(state)

    return (
      <div className={cx('headerMobileContainer')}>
        <div className={cx('logo')}>
          <NavLink to="/markets/list">
            <div className={cx('headerLogo', 'beta')} style={logoVars} />
          </NavLink>
        </div>
        <Menu
          right
          customBurgerIcon={<BurgerIcon addClass={cx({ hiddenIcon: isModalOpen })} />}
          isOpen={menuOpen}
          onStateChange={onStateChangeHandler}
        >
          {canInteract ? (
            <AccountOverview {...this.props} copyAddress={this.copyAddress} />
          ) : (
            <button type="button" className={cx('connect-wallet')} onClick={this.connectWalletClick}>
              {t('header.connect_wallet')}
            </button>
          )}
          <NavLink
            to="/markets/list"
            activeClassName={cx('active')}
            className={cx('navLink', 'bm-item')}
            onClick={this.closeMenu}
          >
            {t('header.markets')}
          </NavLink>
          <Hairline style={HairlineStyle} />
          {canInteract && (
            <>
              <NavLink
                to="/dashboard"
                activeClassName={cx('active')}
                className={cx('navLink', 'bm-item')}
                onClick={this.closeMenu}
              >
                {t('header.dashboard')}
              </NavLink>
              <Hairline style={HairlineStyle} />
            </>
          )}
          {showScoreboard && (
            <>
              <NavLink
                to="/scoreboard"
                activeClassName={cx('active')}
                className={cx('navLink', 'bm-item')}
                onClick={this.closeMenu}
              >
                {t('header.scoreboard')}
              </NavLink>
              <Hairline style={HairlineStyle} />
            </>
          )}
          {showGameGuide && (
            <>
              {gameGuideType === 'default' ? (
                <>
                  <NavLink
                    to="/game-guide"
                    activeClassName={cx('active')}
                    className={cx('navLink', 'bm-item')}
                    onClick={this.closeMenu}
                  >
                    {t('header.gameguide')}
                  </NavLink>
                  <Hairline style={HairlineStyle} />
                </>
              ) : null}
              {gameGuideType === 'link' ? (
                <>
                  <a
                    href={gameGuideURL}
                    className={cx('navLink', 'bm-item')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.closeMenu}
                  >
                    {t('header.gameguide')}
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
  showGameGuide: PropTypes.bool,
  showScoreboard: PropTypes.bool,
  canInteract: PropTypes.bool.isRequired,
  logoVars: PropTypes.shape({
    '--logoPath': PropTypes.string,
    '-smallLogoPath': PropTypes.string,
  }).isRequired,
  tokenBalanceIsWrappedEther: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

MobileHeader.defaultProps = {
  showGameGuide: false,
  showScoreboard: false,
}

export default MobileHeader
