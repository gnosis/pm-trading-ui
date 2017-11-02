import React from 'react'
import PropTypes from 'prop-types'
import './TransactionExplanation.less'

const TransactionsExplanation = ({ transactions, closeModal }) => (
  <div className="transactionsExplanation">
    <div className="container transactionsExplanation__container">
      <a className="transactionsExplanation__close" href="javascript:void(0);" onClick={() => closeModal()} />
      <h3>We will ask you to approve the following transactions with your <strong>uPort App</strong></h3>
      <ul className="transactionsExplanation__transaction-list">
        {transactions.map((transaction, index) => <li key={transaction}>{`${index + 1}. ${transaction}`}</li>)}
      </ul>
      <h4>To approve this transaction, use your uPort App on your mobile device and sign the transaction by either entering your PIN/Password or by using your devices authorisation method, like a fingerprint sensor or a facescanner.</h4>
    </div>
  </div>
)

TransactionsExplanation.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.string),
    closeModal: PropTypes.func,
}

export default TransactionsExplanation
