import { connect } from 'react-redux'
import TransactionsExplanation from 'components/TransactionsExplanation'
import { getTransactions } from 'selectors/modal'

const mapStateToProps = state => ({
  transactions: getTransactions(state),
})

export default connect(mapStateToProps)(TransactionsExplanation)
