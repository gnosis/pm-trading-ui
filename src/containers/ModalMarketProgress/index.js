import { connect } from 'react-redux'

import { transactionSelector, getTransactionLogs, getTransactionProgress, getTransactionComplete } from 'selectors/transactions'
import MarketProgress from 'components/MarketProgress'

const mapStateToProps = (state, ownProps) => ({
  logs: getTransactionLogs(state, ownProps.transactionId),
  progress: getTransactionProgress(state, ownProps.transactionId),
  success: getTransactionComplete(state, ownProps.transactionId),
  transaction: transactionSelector(state, ownProps.transactionId),
})

export default connect(mapStateToProps)(MarketProgress)
