import React from 'react'
import PropTypes from 'prop-types'
import './TransactionExplanation.less'

const TransactionsExplanation = ({ transactions, closeModal }) => (
  <div className="transactionsExplanation">
    <a className="transactionsExplanation__close" href="javascript:void(0);" onClick={() => closeModal()} />
    <h3>We will ask you to approve the following transactions:</h3>
    <ul className="transactionsExplanation__transaction-list">
      {transactions.map((transaction, index) => <li key={transaction}>{`${index + 1}. ${transaction}`}</li>)}
    </ul>
  </div>
)

TransactionsExplanation.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.string),
  closeModal: PropTypes.func,
}

export default TransactionsExplanation
