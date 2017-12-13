import MarketBuySharesForm from 'components/MarketBuySharesForm'
import MarketResolveForm from 'components/MarketResolveForm'
import MarketMySharesForm, { MY_TOKENS } from 'components/MarketMySharesForm'
import MarketWithdrawFeesForm from 'components/MarketWithdrawFeesForm'
import MarketMyTrades from 'components/MarketMyTrades'
import Decimal from 'decimal.js'
import { isMarketClosed, isMarketResolved } from '../../utils/helpers'

export const EXPAND_BUY_SHARES = 'buy-shares'
export const EXPAND_MY_TRADES = 'my-trades'
export const EXPAND_MY_SHARES = 'my-shares'
export const EXPAND_RESOLVE = 'resolve'
export const EXPAND_WITHDRAW_FEES = 'withdraw-fees'

const expandableViews = ({
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
  /* HIDDEN
  [EXPAND_SHORT_SELL]: {
    label: 'Short Sell',
    className: 'btn btn-primary',
    component: MarketShortSellForm,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      !props.market.oracle.isOutcomeSet &&
      props.market.eventDescription.outcomes &&
      props.market.eventDescription.outcomes.length > 2,
  }, */
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
  [EXPAND_RESOLVE]: {
    label: 'Resolve',
    className: 'btn btn-default',
    component: MarketResolveForm,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      props.defaultAccount === props.market.oracle.owner &&
      !isMarketResolved(props.market),
  },
  [EXPAND_WITHDRAW_FEES]: {
    label: 'Withdraw fees',
    className: 'btn btn-default',
    component: MarketWithdrawFeesForm,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      props.market.oracle.owner === props.defaultAccount &&
      new Decimal(props.market.collectedFees).gt(0),
  },
})

export default expandableViews
