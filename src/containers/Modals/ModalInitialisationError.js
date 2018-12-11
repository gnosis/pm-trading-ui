import InitialisationError from 'components/ModalContent/InitialisationError'
import { connect } from 'react-redux'
import { getProviderModalData } from 'store/selectors/modal'

const mapStateToProps = state => ({
  providerName: getProviderModalData(state),
})

export default connect(
  mapStateToProps,
  null,
)(InitialisationError)
