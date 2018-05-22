import { isMarketClosed, isMarketResolved } from 'utils/helpers'
import { getProviderConfig, isFeatureEnabled } from 'utils/features'
import { WALLET_PROVIDER } from 'integrations/constants'
import MarketBuySharesForm from './MarketBuySharesForm'
import MarketMySharesForm, { MY_TOKENS } from './MarketMySharesForm'
import MarketMyTrades from './MarketMyTrades'

export const EXPAND_BUY_SHARES = 'buy-shares'
export const EXPAND_MY_TRADES = 'my-trades'
export const EXPAND_MY_SHARES = 'my-shares'

const showExpandableTournament = (props) => {
  if (!isFeatureEnabled('tournament')) {
    return true
  }
  const requireRegistration = isFeatureEnabled('registration')

  const providerConfig = getProviderConfig()
  let showExpandable = false
  if (
    providerConfig.default === WALLET_PROVIDER.METAMASK &&
    !!props.defaultAccount &&
    (!requireRegistration || !!props.mainnetAddress)
  ) {
    showExpandable = true
  } else if (providerConfig === WALLET_PROVIDER.UPORT && !!props.defaultAccount) {
    showExpandable = true
  }

  return showExpandable
}

const expandableViews = {
  [EXPAND_BUY_SHARES]: {
    label: 'Buy Tokens',
    className: 'btn btn-default',
    component: MarketBuySharesForm,
    showCondition: props =>
      props.market &&
      !props.market.local &&
      !!props.defaultAccount &&
      props.defaultAccount !== props.market.owner &&
      !isMarketClosed(props.market) &&
      !isMarketResolved(props.market) &&
      showExpandableTournament(props),
  },
  [EXPAND_MY_SHARES]: {
    label: MY_TOKENS,
    className: 'btn btn-default',
    component: MarketMySharesForm,
    showCondition: props => props.market && !!props.defaultAccount && showExpandableTournament(props),
  },
  [EXPAND_MY_TRADES]: {
    label: 'My Trades',
    className: 'btn btn-default',
    component: MarketMyTrades,
    showCondition: props => props.market && !!props.defaultAccount && showExpandableTournament(props),
  },
}

export default expandableViews
