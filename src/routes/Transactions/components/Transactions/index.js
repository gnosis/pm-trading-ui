import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { Map } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Icon from 'components/Icon'
import Transaction from './Transaction'
import style from './Transactions.scss'

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
          {runningTransactions.isEmpty() && (
            <div className={cx('transaction')}>There are no currently running transactions</div>
          )}
          {runningTransactions
            .toArray()
            .map(transaction => <Transaction key={transaction.id} type="running" {...transaction.toObject()} />)}
          <div className={cx('heading')}>
            <div className={cx('headingIcon')}>
              <Icon type="countdown" size={48} />
            </div>
            Previous Transactions
          </div>
          {completedTransactions.isEmpty() && (
            <div className={cx('transaction')}>There are no previous transactions</div>
          )}
          {completedTransactions
            .toArray()
            .map(transaction => <Transaction key={transaction.id} type="completed" {...transaction.toObject()} />)}
        </div>
      </div>
    )
  }
}

Transactions.propTypes = {
  changeUrl: PropTypes.func.isRequired,
  // eslint-disable-next-line
  completedTransactions: ImmutablePropTypes.map,
  currentAccount: PropTypes.string,
  // eslint-disable-next-line
  runningTransactions:ImmutablePropTypes.map,
}

Transactions.defaultProps = {
  completedTransactions: Map({}),
  runningTransactions: Map({}),
  currentAccount: undefined,
}

export default Transactions
