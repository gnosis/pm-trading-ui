import SelectProvider from 'components/ModalContent/SelectProvider'
import { connect } from 'react-redux'
import { openModal } from 'store/actions/modal'
import { getModalData } from 'store/selectors/modal'
import { getProvidersList } from 'integrations/store/selectors'

const mapStateToProps = state => ({
  providersList: getProvidersList(state),
  modalData: getModalData(state),
})

export default connect(mapStateToProps, null)(SelectProvider)
