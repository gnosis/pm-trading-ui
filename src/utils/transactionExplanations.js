export const DEPOSIT = (amount = '', currency = 'OLY Token', outcomeTokens = '') => `Depositing ${amount} ${currency} to buy ${outcomeTokens} outcome tokens from this market`

export const SELL = (outcomeTokens = '') => `Selling ${outcomeTokens} outcome tokens back to the market`

export const OUTCOME_TOKENS = 'Transaction of outcome tokens'

export const SETTING_ALLOWANCE = 'Setting allowance'

export const REVOKE_TOKENS = 'Revoke of outcome tokens'
