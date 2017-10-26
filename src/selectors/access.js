import {
  hasWallet,
  isConnectedToCorrectNetwork,
  isGnosisInitialized,
} from './blockchain'

import { INTERACTION_STATE } from 'utils/constants'

const canInteract = (state) => {
  if (!isGnosisInitialized(state)) {
    return INTERACTION_STATE.LOADING
  }

  if (!hasWallet(state) || !isConnectedToCorrectNetwork(state)) {
    return INTERACTION_STATE.DENIED
  }
}

export const getBuySharesAccess = state => canInteract(state) || INTERACTION_STATE.ALLOWED

export const canSellShares = state => canInteract(state) || INTERACTION_STATE.ALLOWED

export const canCreateMarkets = state => canInteract(state) || INTERACTION_STATE.ALLOWED

export const canResolveMarkets = state => canInteract(state) || INTERACTION_STATE.ALLOWED

export const canCloseMarkets = state => canInteract(state) || INTERACTION_STATE.ALLOWED
