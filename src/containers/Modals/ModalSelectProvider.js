import SelectProvider from 'components/ModalContent/SelectProvider'
import { connect } from 'react-redux'
import { getProvidersList } from 'integrations/store/selectors'

const mapStateToProps = state => ({
  providersList: getProvidersList(state),
})

export default connect(mapStateToProps)(SelectProvider)
