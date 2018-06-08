import { connect } from 'react-redux'
import TransactionFloater from 'components/TransactionFloater'
import { showTransactionLog, hideTransactionLog } from 'routes/Transactions/store/actions/transactions'
import {
  getRunningTransactions,
  getCompletedTransactions,
  getRunningTransactionsProgress,
  areLogsVisible,
} from 'routes/Transactions/store/selectors/transactions'
import { getVisibleNotifications } from 'store/selectors/notifications'

const LIMIT_COUNT_RUNNING_TRANSACTIONS = 3
const LIMIT_COUNT_COMPLETED_TRANSACTIONS = 3

const mapStateToProps = state => ({
  runningTransactions: getRunningTransactions(state).takeLast(LIMIT_COUNT_RUNNING_TRANSACTIONS),
  completedTransactions: getCompletedTransactions(state).takeLast(LIMIT_COUNT_COMPLETED_TRANSACTIONS),
  progress: getRunningTransactionsProgress(state),
  notifications: getVisibleNotifications(state),
  showLogs: areLogsVisible(state),
})

export default connect(mapStateToProps, {
  showTransactionLog,
  hideTransactionLog,
})(TransactionFloater)
