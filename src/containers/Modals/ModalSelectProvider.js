import SelectProvider from 'components/ModalContent/SelectProvider'
import { connect } from 'react-redux'
import { openModal } from 'store/actions/modal'
import { getProvidersList } from 'integrations/store/selectors'
import { initProviders } from 'integrations/store/actions'

const mapStateToProps = state => ({
  providersList: getProvidersList(state),
})

const mapDispatchToProps = dispatch => ({
  initProviders: provider => dispatch(initProviders({ provider })),
  openModal: (modalName, modalData) => dispatch(openModal({ modalName, modalData })),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectProvider)
