import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import style from './TransactionExplanation.scss'

const cx = cn.bind(style)

const TransactionsExplanation = ({ transactions, closeModal, t }) => (
  <div className={cx('transactionsExplanation')}>
    <button type="button" className={cx('closeButton')} onClick={() => closeModal()} />
    <h3>{t('transaction_explanations.heading')}</h3>
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
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(TransactionsExplanation)
