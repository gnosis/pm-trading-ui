import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Transaction from 'components/Transaction'
import { transactionShape } from 'utils/shapes'

import './Transactions.less'

class Transactions extends Component {
  componentWillMount() {
    if (!this.props.currentAccount) {
      this.props.changeUrl('/markets/list')
    }
  }

  render() {
    const { runningTransactions, completedTransactions } = this.props
    return (
      <div className="transactionsPage">
        <div className="container">
          <div className="transactionsPage__heading">
            <div className="transactionsPage__headingIcon">
              <div className="icon icon--new" />
            </div>
            Currently Running Transactions
          </div>
          {!runningTransactions.length && (
            <div className="transactionsPage__transaction transactionsPage__transaction--empty transaction">
              There are no currently running transactions
            </div>
          )}
          {runningTransactions.map(transaction => <Transaction key={transaction.id} type="running" {...transaction} />)}
          <div className="transactionsPage__heading">
            <div className="transactionsPage__headingIcon">
              <div className="icon icon--countdown" />
            </div>
            Previous Transactions
          </div>
          {!completedTransactions.length && (
            <div className="transactionsPage__transaction transactionsPage__transaction--empty transaction">
              There are no previous transactions
            </div>
          )}
          {completedTransactions.map(transaction => (
            <Transaction key={transaction.id} type="completed" {...transaction} />
          ))}
        </div>
      </div>
    )
  }
}

Transactions.propTypes = {
  changeUrl: PropTypes.func,
  completedTransactions: PropTypes.arrayOf(transactionShape),
  currentAccount: PropTypes.string,
  runningTransactions: PropTypes.arrayOf(transactionShape),
}

export default Transactions
