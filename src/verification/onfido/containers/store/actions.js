import { setLegalDocumentsAccepted } from 'integrations/store/actions'
import { setVerificationStatus } from 'store/actions/account'
import { signMessage } from 'api/account'
import * as api from '../../api'

const requestUserVerification = (...args) => async () => api.requestUserVerification(...args)
const createUserVerification = (...args) => async () => api.createUserVerification(...args)
const startUserReport = (...args) => async () => api.startUserReport(...args)

const updateUserVerification = account => async (dispatch) => {
  const verificationUser = await api.requestUserVerification(account)

  if (verificationUser) {
    if (verificationUser.isVerified) {
      // user is verified, close the modal and save the setting
      dispatch(setVerificationStatus('onfido'))
      return true
    }

    // user exists but is not verified, push report generation (incase it didnt work the first time)
    await api.startUserReport(account)
    return false
  }

  return false
}

const promptSignMessage = msg => async () => signMessage(msg)

export default {
  setLegalDocumentsAccepted,
  promptSignMessage,
  startUserReport,
  updateUserVerification,
  requestUserVerification,
  createUserVerification,
}
