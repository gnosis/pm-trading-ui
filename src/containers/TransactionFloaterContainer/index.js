import { connect } from 'react-redux'

import TransactionFloater from 'components/TransactionFloater'

import { getAllRunningTransactions, getAllCompletedTransactions, getRunningTransactionsProgress} from 'selectors/transactions'

const mapStateToProps = state => ({
  runningTransactions: getAllRunningTransactions(state),
  completedTransactions: getAllCompletedTransactions(state),
  progress: getRunningTransactionsProgress(state),
})

export default connect(mapStateToProps)(TransactionFloater)
