import { connect } from 'react-redux'
import Verification from 'components/ModalContent/Verification'

import { closeModal } from 'store/actions/modal'
import { setLegalDocumentsAccepted } from 'integrations/store/actions'

const mapDispatchToProps = {
  setLegalDocumentsAccepted,
  closeModal,
}

export default connect(null, mapDispatchToProps)(Verification)
