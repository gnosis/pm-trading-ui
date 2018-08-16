import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import style from './TransactionExplanation.scss'

const cx = cn.bind(style)

const TransactionsExplanation = ({ transactions, closeModal }) => (
  <div className={cx('transactionsExplanation')}>
    <div className={cx('closeButton')} onClick={() => closeModal()} />
    <h3>We will ask you to approve the following transactions:</h3>
    <ul className={cx('transactionlist')}>
      {transactions.map((transaction, index) => (
        <li key={transaction}>{`${index + 1}. ${transaction}`}</li>
      ))}
    </ul>
  </div>
)

TransactionsExplanation.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default TransactionsExplanation
