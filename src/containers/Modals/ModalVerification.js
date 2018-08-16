import { connect } from 'react-redux'
import Verification from 'components/ModalContent/Verification'

import { setLegalDocumentsAccepted } from 'integrations/store/actions'

const mapDispatchToProps = {
  setLegalDocumentsAccepted,
}

export default connect(null, mapDispatchToProps)(Verification)
