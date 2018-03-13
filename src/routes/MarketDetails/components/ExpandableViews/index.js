import Decimal from 'decimal.js'
import { isMarketClosed, isMarketResolved } from 'utils/helpers'
import MarketBuySharesForm from './MarketBuySharesForm'
import MarketMySharesForm, { MY_TOKENS } from './MarketMySharesForm'
import MarketMyTrades from './MarketMyTrades'

export const EXPAND_BUY_SHARES = 'buy-shares'
export const EXPAND_MY_TRADES = 'my-trades'
export const EXPAND_MY_SHARES = 'my-shares'

const expandableViews = {
  [EXPAND_BUY_SHARES]: {
    label: 'Buy Tokens',
    className: 'btn btn-default',
    component: MarketBuySharesForm,
    showCondition: props =>
      props.market &&
      !props.market.local &&
      props.defaultAccount &&
      props.defaultAccount !== props.market.owner &&
      !isMarketClosed(props.market) &&
      !isMarketResolved(props.market),
  },
  [EXPAND_MY_SHARES]: {
    label: MY_TOKENS,
    className: 'btn btn-default',
    component: MarketMySharesForm,
    showCondition: props => props.market && props.defaultAccount,
  },
  [EXPAND_MY_TRADES]: {
    label: 'My Trades',
    className: 'btn btn-default',
    component: MarketMyTrades,
    showCondition: props => props.market && props.defaultAccount,
  },
}

export default expandableViews
