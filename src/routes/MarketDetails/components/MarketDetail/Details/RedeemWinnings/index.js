import React from 'react'
import PropTypes from 'prop-types'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import { collateralTokenToText } from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'

const RedeemWinnings = ({
  collateralToken, winningsAmount, handleRedeemWinnings, transactionGas,
}) => (
  <div className="redeemWinning">
    <div className="redeemWinning__icon-details-container">
      <div className="redeemWinning__icon icon icon--achievementBadge" />
      <div className="redeemWinning__details">
        <div className="redeemWinning__heading">
          <DecimalValue value={weiToEth(winningsAmount)} /> {collateralTokenToText(collateralToken)}
        </div>
        <div className="redeemWinning__label">Your Winnings</div>
      </div>
    </div>
    <div className="redeemWinning__action">
      <InteractionButton className="btn btn-primary" onClick={handleRedeemWinnings}>
        Redeem Winnings
      </InteractionButton>
      <span className="redeemWinning__gasCost">Gas cost: {transactionGas} ETH</span>
    </div>
  </div>
)

RedeemWinnings.propTypes = {
  collateralToken: PropTypes.string.isRequired,
  winningsAmount: PropTypes.string.isRequired,
  handleRedeemWinnings: PropTypes.func.isRequired,
  transactionGas: PropTypes.string.isRequired,
}

export default RedeemWinnings
