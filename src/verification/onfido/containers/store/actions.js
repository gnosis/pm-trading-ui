import { setLegalDocumentsAccepted } from 'integrations/store/actions'
import { setVerificationStatus } from 'store/actions/account'
import { signMessage } from 'api/account'
import * as api from '../../api'

const requestUserVerification = (...args) => async () => api.requestUserVerification(...args)
const createUserVerification = (...args) => async () => api.createUserVerification(...args)
const startUserReport = (...args) => async () => api.startUserReport(...args)

const updateUserVerification = account => async (dispatch) => {
  const pendingVerification = await api.requestUserVerification(account)

  if (pendingVerification) {
    if (pendingVerification.status) {
      if (pendingVerification.status === 'ACCEPTED') {
        // user is verified, close the modal and save the setting
        dispatch(setVerificationStatus(account, 'onfido'))
        return 'ACCEPTED'
      }

      return pendingVerification.status
    }

    // in some weird case where we get an empty object?
    await api.startUserReport(account)
    return 'PENDING'
  }

  return 'PENDING'
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
