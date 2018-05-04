import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { NavLink } from 'react-router-dom'
import { takeRight } from 'lodash'
import moment from 'moment'
import LabeledSpinner from 'components/Spinner/Labeled'
import ProgressSpinner from 'components/Spinner/Transaction'
import Notifications from 'components/Notifications'
import Icon from 'components/Icon'
import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'
import style from './transactionFloater.mod.scss'

const cx = cn.bind(style)

const TransactionFloater = ({
  progress,
  runningTransactions,
  completedTransactions,
  notifications,
  showLogs,
  hideTransactionLog,
  showTransactionLog,
}) => (
  <div className={cx('transactionFloater')}>
    <button className={cx('spinner')} onClick={() => (showLogs ? hideTransactionLog() : showTransactionLog())}>
      <LabeledSpinner
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
    </button>
    {!showLogs &&
      notifications.length > 0 && (
      <div className={cx('popover', 'notifications')}>
        <Notifications notifications={takeRight(notifications, 5)} onClick={showTransactionLog} />
      </div>
    )}
    <div className={cx('popover', showLogs ? 'visible' : 'hidden')}>
      <div className={cx('heading')}>Transactions</div>
      <button className={cx('closeButton')} onClick={() => hideTransactionLog()} />
      <div className={cx('logs')}>
        {!runningTransactions.length &&
          !completedTransactions.length && (
          <div className={cx('transactionLog', 'empty')}>
            <div className={cx('label')}>You have no active or past transactions.</div>
            <div className={cx('hint')}>
                When you interact with markets, all transactions will show up down here so you can keep track of all
                your purchases, investments and market interactions.
            </div>
          </div>
        )}
        {runningTransactions.map((transaction) => {
          const startTime = transaction.startTime ? moment(transaction.startTime).format('LLL') : ''

          return (
            <div key={transaction.id} className={cx('transactionLog')}>
              <div className={cx('progress')}>
                <ProgressSpinner
                  width={16}
                  height={16}
                  strokeWidthPx={1}
                  fontSizePx={8}
                  progress={transaction.progress}
                  modifier="spinning"
                />
              </div>
              <div className={cx('label')}>{transaction.label || 'Unnamed Transaction'}</div>
              <div className={cx('startTime')}>{startTime}</div>
            </div>
          )
        })}
        {completedTransactions.map((transaction) => {
          const endTime = transaction.endTime ? moment(transaction.endTime).format('LLL') : ''
          const timeDiff =
            transaction.startTime && transaction.endTime
              ? moment(transaction.startTime).to(moment(transaction.endTime), true)
              : undefined

          const icon = transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR ? 'checkmark' : 'cross'
          return (
            <div key={transaction.id} className={cx('transactionLog')}>
              <Icon type={icon} className={cx('progressIcon')} />
              <div className={cx('label')}>{transaction.label || 'Unnamed Transaction'}</div>
              <div className={cx('startTime')}>
                {endTime} {timeDiff && `(took ${timeDiff})`}
              </div>
            </div>
          )
        })}
      </div>
      <div className={cx('footer')}>
        <NavLink to="/transactions" onClick={hideTransactionLog}>
          Show all transactions
        </NavLink>
      </div>
    </div>
  </div>
)

TransactionFloater.propTypes = {
  progress: PropTypes.number.isRequired,
  runningTransactions: PropTypes.arrayOf(PropTypes.object),
  completedTransactions: PropTypes.arrayOf(PropTypes.object),
  notifications: PropTypes.arrayOf(PropTypes.object),
  showLogs: PropTypes.bool,
  hideTransactionLog: PropTypes.func.isRequired,
  showTransactionLog: PropTypes.func.isRequired,
}

TransactionFloater.defaultProps = {
  notifications: [],
  runningTransactions: [],
  completedTransactions: [],
  showLogs: false,
}

export default TransactionFloater
