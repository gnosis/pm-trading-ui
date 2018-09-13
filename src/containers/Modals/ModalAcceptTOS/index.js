import AcceptTOS from 'components/ModalContent/AcceptTOS'
import { connect } from 'react-redux'
import { initProviders, setLegalDocumentsAccepted } from 'integrations/store/actions'

const mapDispatchToProps = {
  initProviders,
  setLegalDocumentsAccepted,
}

export default connect(null, mapDispatchToProps)(AcceptTOS)
