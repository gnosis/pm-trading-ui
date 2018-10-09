import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import { NavLink } from 'react-router-dom'
import { upperFirst } from 'lodash'
import Identicon from '../../Identicon'
import ProviderIcon from '../../ProviderIcon'
import BadgeIcon from '../../BadgeIcon'
import MenuAccountDropdown from '../../MenuAccountDropdown'
import style from './DesktopHeader.scss'

const cx = cn.bind(style)

const DesktopHeader = ({
  version,
  logoVars,
  canInteract,
  showScoreboard,
  gameGuideLink,
  currentNetwork,
  tokenBalance,
  tokenSymbol,
  badgesEnabled,
  userTournamentInfo,
  currentProvider,
  currentAccount,
  useUport,
  handleConnectWalletClick,
  showGameGuide,
  gameGuideType,
  gameGuideURL,
}) => (
  <div className={cx('container', 'containerFlex')}>
    <div className={cx('group', 'logo')}>
      <NavLink to="/markets/list">
        <div className={cx('headerLogo', 'beta')} style={logoVars} />
      </NavLink>
    </div>
    <div className={cx('group', 'left', 'version')}>{version}</div>
    <div className={cx('group', 'left', 'navLinks')}>
      <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
        Markets
      </NavLink>
      {canInteract && (
        <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
          Dashboard
        </NavLink>
      )}
      {showScoreboard && (
        <NavLink to="/scoreboard" activeClassName={cx('active')} className={cx('navLink')}>
          Scoreboard
        </NavLink>
      )}
      {gameGuideType === 'default' ? (
        <NavLink to="/game-guide" activeClassName={cx('active')} className={cx('navLink')}>
          Game guide
        </NavLink>
      ) : null}
      {gameGuideType === 'link' ? (
        <a href={gameGuideURL} className={cx('navLink')} target="_blank" rel="noopener noreferrer">
          Game Guide
        </a>
      ) : null}
    </div>

    <div className={cx('group', 'right')}>
      {canInteract ? (
        <div className={cx('account')}>
          {currentNetwork
            && currentNetwork !== 'MAIN' && (
            <span className={cx('network', 'text')}>
                Network:
              {upperFirst(currentNetwork.toLowerCase())}
            </span>
          )}
          <DecimalValue value={tokenBalance} className={cx('text')} />
          &nbsp;
          {<span>{tokenSymbol || 'ETH'}</span>}
          {badgesEnabled && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
          <ProviderIcon provider={currentProvider} />
          <Identicon account={currentAccount} />
          {useUport && <MenuAccountDropdown />}
        </div>
      ) : (
        <button type="button" className={cx('connect-wallet')} onClick={handleConnectWalletClick}>
          Connect a wallet
        </button>
      )}
    </div>
  </div>
)

export default DesktopHeader
