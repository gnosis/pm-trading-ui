import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { NavLink } from 'react-router-dom'
import Tooltip from 'rc-tooltip'
import { upperFirst } from 'lodash'
import Balance from 'components/Header/Balance'
import { generateWalletName, hexWithoutPrefix } from 'utils/helpers'
import { providerPropType } from 'utils/shapes'
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
  etherBalance,
  tokenBalanceIsWrappedEther,
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
      {showGameGuide && (
        <>
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
        </>
      )}
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
          <Balance
            etherBalance={etherBalance}
            tokenBalance={tokenBalance}
            tokenSymbol={tokenSymbol}
            isWrappedEther={tokenBalanceIsWrappedEther}
          />
          {badgesEnabled && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
          <ProviderIcon provider={currentProvider} />
          <Tooltip
            placement="left"
            overlay={`"${generateWalletName(currentAccount)}" (${hexWithoutPrefix(currentAccount)})`}
          >
            <Identicon account={currentAccount} />
          </Tooltip>
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

DesktopHeader.propTypes = {
  version: PropTypes.string,
  currentNetwork: PropTypes.string,
  etherBalance: PropTypes.string,
  tokenBalance: PropTypes.string,
  tokenBalanceIsWrappedEther: PropTypes.bool,
  currentProvider: providerPropType,
  currentAccount: PropTypes.string,
  userTournamentInfo: PropTypes.shape({}),
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenSymbol: PropTypes.string,
  handleConnectWalletClick: PropTypes.func.isRequired,
  useUport: PropTypes.bool,
  logoVars: PropTypes.shape({
    '--logoPath': PropTypes.string,
    '-smallLogoPath': PropTypes.string,
  }).isRequired,
  canInteract: PropTypes.bool.isRequired,
  badgesEnabled: PropTypes.bool.isRequired,
}

DesktopHeader.defaultProps = {
  version: '',
  currentNetwork: '',
  tokenBalance: '0',
  etherBalance: '0',
  currentProvider: {},
  currentAccount: '',
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
  userTournamentInfo: undefined,
  tokenSymbol: 'ETH',
  useUport: false,
  tokenBalanceIsWrappedEther: false,
}

export default DesktopHeader
