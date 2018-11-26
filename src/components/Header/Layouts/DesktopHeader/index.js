import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { NavLink } from 'react-router-dom'
import Tooltip from 'rc-tooltip'
import Balance from 'components/Header/Balance'
import { generateWalletName, hexWithoutPrefix } from 'utils/helpers'
import { providerPropType } from 'utils/shapes'
import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import WrongNetwork from './components/WrongNetwork'
import Identicon from '../../Identicon'
import ProviderIcon from '../../ProviderIcon'
import BadgeIcon from '../../BadgeIcon'
import MenuAccountDropdown from '../../MenuAccountDropdown'
import style from './DesktopHeader.scss'

const cx = cn.bind(style)

const DesktopHeader = ({
  logoVars,
  canInteract,
  showScoreboard,
  targetNetworkId,
  tokenBalance,
  tokenSymbol,
  badgesEnabled,
  userTournamentInfo,
  currentProvider,
  currentAccount,
  handleConnectWalletClick,
  showGameGuide,
  gameGuideType,
  gameGuideURL,
  etherBalance,
  tokenBalanceIsWrappedEther,
  isConnectedToCorrectNetwork,
  t,
}) => (
  <div className={cx('container', 'containerFlex')}>
    <div className={cx('group', 'logo')}>
      <NavLink to="/markets/list">
        <div className={cx('headerLogo', 'beta')} style={logoVars} />
      </NavLink>
    </div>
    <div className={cx('group', 'left', 'navLinks')}>
      <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
        {t('header.markets')}
      </NavLink>
      {canInteract && (
        <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
          {t('header.dashboard')}
        </NavLink>
      )}
      {showScoreboard && (
        <NavLink to="/scoreboard" activeClassName={cx('active')} className={cx('navLink')}>
          {t('header.scoreboard')}
        </NavLink>
      )}
      {showGameGuide && (
        <>
          {gameGuideType === 'default' ? (
            <NavLink to="/game-guide" activeClassName={cx('active')} className={cx('navLink')}>
              {t('header.gameguide')}
            </NavLink>
          ) : null}
          {gameGuideType === 'link' ? (
            <a href={gameGuideURL} className={cx('navLink')} target="_blank" rel="noopener noreferrer">
              {t('header.gameguide')}
            </a>
          ) : null}
        </>
      )}
    </div>

    <div className={cx('group', 'right')}>
      {canInteract ? (
        <div className={cx('account')}>
          {!isConnectedToCorrectNetwork && <WrongNetwork targetNetwork={ETHEREUM_NETWORK_IDS[targetNetworkId]} />}
          <Balance
            etherBalance={etherBalance}
            tokenBalance={tokenBalance}
            tokenSymbol={tokenSymbol}
            isWrappedEther={tokenBalanceIsWrappedEther}
          />
          {badgesEnabled && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
          <ProviderIcon provider={currentProvider} />
          <Tooltip
            placement="bottom"
            overlay={`"${generateWalletName(currentAccount)}" (${hexWithoutPrefix(currentAccount)})`}
          >
            <Identicon account={currentAccount} />
          </Tooltip>
          <MenuAccountDropdown />
        </div>
      ) : (
        <button type="button" className={cx('connect-wallet')} onClick={handleConnectWalletClick}>
          {t('header.connect_wallet')}
        </button>
      )}
    </div>
  </div>
)

DesktopHeader.propTypes = {
  isConnectedToCorrectNetwork: PropTypes.bool.isRequired,
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
  logoVars: PropTypes.shape({
    '--logoPath': PropTypes.string,
    '-smallLogoPath': PropTypes.string,
  }).isRequired,
  canInteract: PropTypes.bool.isRequired,
  badgesEnabled: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  targetNetworkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

DesktopHeader.defaultProps = {
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
  tokenBalanceIsWrappedEther: false,
  targetNetworkId: undefined,
}

export default DesktopHeader
