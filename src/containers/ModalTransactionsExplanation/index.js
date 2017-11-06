import { connect } from 'react-redux'
import TransactionsExplanation from 'components/TransactionsExplanation'
import { getModalErrorMessage, getTransactions, getStatus } from 'selectors/modal'

const mapStateToProps = state => ({
  transactions: getTransactions(state),
  errorMessage: getModalErrorMessage(state),
  status: getStatus(state),
})

export default connect(mapStateToProps)(TransactionsExplanation)
