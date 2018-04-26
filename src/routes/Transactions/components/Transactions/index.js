import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Icon from 'components/Icon'
import { transactionShape } from 'utils/shapes'
import Transaction from './Transaction'
import style from './Transactions.mod.scss'

const cx = cn.bind(style)

class Transactions extends Component {
  componentDidMount() {
    if (!this.props.currentAccount) {
      this.props.changeUrl('/markets/list')
    }
  }

  render() {
    const { runningTransactions, completedTransactions } = this.props
    return (
      <div className={cx('transactionsPage')}>
        <div className="container">
          <div className={cx('heading')}>
            <div className={cx('headingIcon')}>
              <Icon type="new" size={48} />
            </div>
            Currently Running Transactions
          </div>
          {!runningTransactions.length && (
            <div className={cx('transaction')}>There are no currently running transactions</div>
          )}
          {runningTransactions.map(transaction => <Transaction key={transaction.id} type="running" {...transaction} />)}
          <div className={cx('heading')}>
            <div className={cx('headingIcon')}>
              <Icon type="countdown" size={48} />
            </div>
            Previous Transactions
          </div>
          {!completedTransactions.length && <div className={cx('transaction')}>There are no previous transactions</div>}
          {completedTransactions.map(transaction => (
            <Transaction key={transaction.id} type="completed" {...transaction} />
          ))}
        </div>
      </div>
    )
  }
}

Transactions.propTypes = {
  changeUrl: PropTypes.func.isRequired,
  completedTransactions: PropTypes.arrayOf(transactionShape),
  currentAccount: PropTypes.string,
  runningTransactions: PropTypes.arrayOf(transactionShape),
}

Transactions.defaultProps = {
  completedTransactions: [],
  runningTransactions: [],
  currentAccount: undefined,
}

export default Transactions
