import React from 'react'
import PropTypes from 'prop-types'
import '../TransactionsExplanation/TransactionExplanation.less'

const OutcomePriceChanged = ({ closeModal }) => (
  <div className="transactionsExplanation">
    <a className="transactionsExplanation__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>
        The transaction could not be processed because the trading price changed. <br />
        Please check the new price and try again.
    </h3>
  </div>
)

OutcomePriceChanged.propTypes = {
  closeModal: PropTypes.func,
}

export default OutcomePriceChanged
