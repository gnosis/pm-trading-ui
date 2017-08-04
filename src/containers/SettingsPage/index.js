import { connect } from 'react-redux'
import { reduxForm, formValueSelector, submit } from 'redux-form'

import Settings from 'components/Settings'
import { updateSettings } from 'actions/settings'

const FORM = {
  form: 'settingsForm',
  onChange: async (values, dispatch, props) => {
    const { formValues, syncErrors, pristine, dirty } = props
    if (dirty && !syncErrors.settings) {
      return await dispatch(updateSettings(formValues.settings))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('settingsForm')

  const settings = Object.keys(state.settings).map(
    (key) => {
      if (state.settings[key]){
        return {key, value: state.settings[key]}
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
