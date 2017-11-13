import React from 'react'
import PropTypes from 'prop-types'
import '../TransactionsExplanation/TransactionExplanation.less'

const OutcomePriceChanged = ({ closeModal }) => (
  <div className="transactionsExplanation">
    <a className="transactionsExplanation__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>The price of the outcome has changed</h3>
  </div>
)

OutcomePriceChanged.propTypes = {
  closeModal: PropTypes.func,
}

export default OutcomePriceChanged
