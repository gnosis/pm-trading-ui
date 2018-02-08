import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getRunningTransactions, getCompletedTransactions } from 'selectors/transactions'

import { getCurrentAccount } from 'integrations/selectors'

import Transactions from 'components/Transactions'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  runningTransactions: getRunningTransactions(state),
  completedTransactions: getCompletedTransactions(state),
})

const mapDispatchToProps = {
  changeUrl: push,
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions)
