import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose, withProps } from 'recompose'

import { getRunningTransactions, getCompletedTransactions } from 'routes/Transactions/store/selectors/transactions'
import { getCurrentAccount } from 'integrations/store/selectors'
import Transactions from '../../components/Transactions'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  runningTransactions: getRunningTransactions(state),
  completedTransactions: getCompletedTransactions(state),
})

const enhancer = compose(
  withRouter,
  withProps(({ history }) => ({
    changeUrl: url => history.push(url),
  })),
  connect(
    mapStateToProps,
  ),
)

export default enhancer(Transactions)
