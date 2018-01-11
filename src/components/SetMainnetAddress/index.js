import React from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import PropTypes from 'prop-types'

import { updateMainnetAddress } from 'actions/blockchain'
import { closeModal as closeModalAction } from 'actions/modal'

import { HEX_VALUE_REGEX } from 'utils/constants'

import TextField from 'components/FormInput'
import InteractionButton from 'containers/InteractionButton'

import './style.less'

const SetMainnetAddress = ({
  submitting, handleSubmit, error, submitFailed, closeModal,
}) => (
  <div className="setMainnetAddress">
    <div className="setMainnetAddressModal">
      <a className="setMainnetAddressModal__close" href="javascript:void(0);" onClick={closeModal} />
      <form onSubmit={handleSubmit}>
        <h1 className="setMainnetAddressModal__header">Setup claim Address</h1>
        <p className="setMainnetAddressModal__disclaimer">Please register your Metamask address, where we can send your winning GNO tokens in case you finished in the top 100. Please note that you can register your address <em>only once</em>.</p>

        <Field component={TextField} className="setMainnetAddressModalInput" name="mainnetAddress" placeholder="Ethereum address" />
        <InteractionButton type="submit" className="btn btn-primary setMainnetAddressModalSubmit" loading={submitting}>Save Address</InteractionButton>
        {error && <p className="setMainnetAddressModal__error">{error}</p>}
        {submitFailed && <p className="setMainnetAddressModal__error">Sorry, the transaction failed. Please try again later or contact us!</p>}
      </form>
    </div>
  </div>
)

SetMainnetAddress.propTypes = {
  ...reduxFormPropTypes,
  closeModal: PropTypes.func.isRequired,
}

const FORM = {
  form: 'setMainnetAddressForm',
  onSubmit: async (values, dispatch) => {
    await dispatch(updateMainnetAddress(values.mainnetAddress))
    return dispatch(closeModalAction())
  },
  validate: values => (HEX_VALUE_REGEX.test(values.mainnetAddress) ? {} : { mainnetAddress: 'Please enter a valid address' }),
}

export default reduxForm(FORM)(SetMainnetAddress)
