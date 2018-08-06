import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getRunningTransactions, getCompletedTransactions } from 'routes/Transactions/store/selectors/transactions'
import { getCurrentAccount } from 'integrations/store/selectors'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  runningTransactions: getRunningTransactions(state),
  completedTransactions: getCompletedTransactions(state),
})

const mapDispatchToProps = {
  changeUrl: push,
}

const LoadableTransactions = Loadable({
  loader: () => import('../../components/Transactions'),
  loading: () => null,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadableTransactions)
