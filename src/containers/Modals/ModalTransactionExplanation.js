import { connect } from 'react-redux'
import TransactionsExplanation from 'components/ModalContent/TransactionsExplanation'
import { getModalData } from 'store/selectors/modal'

const mapStateToProps = state => ({
  transactions: getModalData(state),
})

export default connect(mapStateToProps)(TransactionsExplanation)
