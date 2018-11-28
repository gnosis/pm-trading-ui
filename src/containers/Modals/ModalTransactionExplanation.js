import { connect } from 'react-redux'
import TransactionsExplanation from 'components/ModalContent/TransactionsExplanation'
import { getTransactions } from 'store/selectors/modal'

const mapStateToProps = state => ({
  transactions: getTransactions(state),
})

export default connect(mapStateToProps)(TransactionsExplanation)
