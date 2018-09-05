import sha1 from 'sha1'

import { getMainnetAddressForRinkebyAccount, setMainnetAddressForRinkebyAccount } from 'api'
import { getActiveProvider } from 'integrations/store/selectors'
import { saveWalletSetting } from 'integrations/store/actions'
import { getFeatureConfig } from 'utils/features'

const registrationConfig = getFeatureConfig('registration')

export const setMainnetAddress = (account, mainnetAddress) => saveWalletSetting({ account, key: 'mainnetAddress', value: mainnetAddress })
export const setAccountAcceptedDocuments = (account, documentNames) => saveWalletSetting({ account, key: 'acceptedDocuments', value: documentNames })
export const setAccountRewardClaimState = (account, rewardClaimEnd, rewardClaimValue) => (
  saveWalletSetting({ account, key: 'rewardClaimHash', value: sha1(`${rewardClaimEnd}${rewardClaimValue}`) })
)

export const requestMainnetAddress = () => async (dispatch, getState) => {
  const state = getState()
  const provider = getActiveProvider(state).toJS()
  const registrationContractAddress = registrationConfig.contractAddress
  const mainnetAddress = await getMainnetAddressForRinkebyAccount(registrationContractAddress, provider.account)
  dispatch(setMainnetAddress(provider.account, mainnetAddress))
}

export const updateMainnetAddress = mainnetAddress => async (dispatch, getState) => {
  const state = getState()
  const provider = getActiveProvider(state).toJS()
  const registrationContractAddress = registrationConfig.contractAddress
  try {
    await setMainnetAddressForRinkebyAccount(registrationContractAddress, mainnetAddress)
    dispatch(setMainnetAddress(provider.account, mainnetAddress))
  } catch (e) {
    console.error(e)
  }

  dispatch(requestMainnetAddress())
}
