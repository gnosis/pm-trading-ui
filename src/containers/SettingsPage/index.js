import { connect } from 'react-redux'
import { reduxForm, formValueSelector, submit } from 'redux-form'

import Settings from 'components/Settings'
import { updateSettings } from 'actions/settings'

const FORM = {
  form: 'settingsForm',
  onChange: async (values, dispatch, props) => {
    const { formValues, syncErrors, pristine, dirty } = props
    // TODO should only if no errors but seems to be an issue with
    // onchange validation
    // https://github.com/erikras/redux-form/issues/3012
    return await dispatch(updateSettings(formValues.settings))
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('settingsForm')
  console.log('Settings: ', state.settings)
  const settings = Object.keys(state.settings).map(
    (address) => {
      if (state.settings[address]){
        return {address, name: state.settings[address]}
      }
    }
  )

  return {
    formValues: {
      settings: selector(state, 'settings')
    },
    initialValues: {
      settings
    }
  }
}

const mapDispatchToProps = dispatch => ({
  updateSettings: () => dispatch(submit('settingsForm')),
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(Settings))
