import React, { Component } from 'react'
import { Link } from 'react-router'
import autobind from 'autobind-decorator'

import moment from 'moment'

import ProgressSpinner from 'components/ProgressSpinner'

import './transactionFloater.less'

import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

class TransactionFloater extends Component {
  constructor(props) {
    super(props)

    this.state = { visible: false }
  }

  @autobind
  toggleVisible() {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { progress, runningTransactions, completedTransactions } = this.props
    const { visible } = this.state
    return (
      <div className="transactionFloater">
        <div className="transactionFloater__spinner" onClick={this.toggleVisible}>
          <ProgressSpinner
            width={32}
            height={32}
            strokeWidthPx={3}
            fontSizePx={12}
            progress={runningTransactions.length ? progress : 0}
            modifier="spinning"
            label={runningTransactions.length}
            showBar={runningTransactions.length > 0}
            minBarSize={1}
            showLabel={runningTransactions.length > 0}
          />
        </div>
        <div className={`transactionFloater__popover ${visible ? 'transactionFloater__popover--visible' : 'transactionFloater__popover--hidden'}`}>
          <div className="transactionFloater__heading">Transactions</div>
          <div className="transactionFloater__close" onClick={this.toggleVisible} />
          <div className="transactionFloater__logs">
            {!runningTransactions.length && !completedTransactions.length && (
              <div className="transactionLog transactionLog--empty">
                <div className="transactionLog__label">You have no active or past transactions.</div>
                <div className="transactionLog__hint">When you interact with markets, all transactions will show up down here so you can keep track of all your purchases, investments and market interactions.</div>
              </div>
            )}
            {runningTransactions.map((transaction) => {
              const startTime = transaction.startTime ? moment(transaction.startTime).format('LLL') : ''
              
              return (
                <div key={transaction.id} className="transactionLog">
                  <div className="transactionLog__progress">
                    <ProgressSpinner
                      width={16}
                      height={16}
                      strokeWidthPx={1}
                      fontSizePx={8}
                      progress={transaction.progress}
                      modifier="spinning"
                    />
                  </div>
                  <div className="transactionLog__label">{transaction.label || 'Unnamed Transaction'}</div>
                  <div className="transactionLog__startTime">{startTime}</div>
                </div>
              )
            })}
            {completedTransactions.map((transaction) => {
              const endTime = transaction.endTime ? moment(transaction.endTime).format('LLL') : ''
              const timeDiff = (transaction.startTime && transaction.endTime) ? moment(transaction.startTime).to(moment(transaction.endTime), true) : undefined

              const icon = transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR ? 'checkmark' : 'error'
              return (
                <div key={transaction.id} className="transactionLog">
                  <div className={`transactionLog__progressIcon icon icon--${icon}`} />
                  <div className="transactionLog__label">{transaction.label || 'Unnamed Transaction'}</div>
                  <div className="transactionLog__startTime">{endTime} {timeDiff && `(took ${timeDiff})`}</div>
                </div>
              )
            })}
          </div>
          <div className="transactionFloater__footer">
            <Link to="/transactions">Show all transactions</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default TransactionFloater
