import { connect } from 'react-redux'
import { reduxForm, formValueSelector, submit } from 'redux-form'

import Settings from 'components/Settings'
import { updateSettings } from 'actions/settings'

/* USEFUL FOR THE NEXT SETTINGS VERSION
const FORM = {
  form: 'settingsForm',
  onSubmit: async (values, dispatch, props) => {
    const { formValues } = props

    let settingsValues = {
      title: formValues.title,
      description: formValues.description,
      subdomain: formValues.subdomain,
      moderators: formValues.moderators
    }
    console.log(settingsValues)
    return await dispatch(updateSettings(settingsValues))
  },
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('settingsForm')
  return {
    formValues: {
      title: selector(state, 'title'),
      descriptionle: selector(state, 'description'),
      subdomain: selector(state, 'subdomain'),
      moderators: selector(state, 'moderators'),
    },
  }
}*/

const FORM = {
  form: 'settingsForm',
  onChange: async (values, dispatch, props) => {
    const { formValues } = props

    let settingsValues = {
      settings: formValues.settings
    }
    //console.log('REUDX2: ', updateSettings(settingsValues))
    //console.log('Form Values: ', formValues)
    return await dispatch(updateSettings(settingsValues))
  },
  onSubmit: async (values, dispatch, props) => {
    console.log('SUBMIT', values)
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('settingsForm')
  return {
    formValues: {
      settings: selector(state, 'settings')
    }
  }
}

const mapDispatchToProps = dispatch => ({
  updateSettings: () => dispatch(submit('settingsForm')),
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(Settings))
