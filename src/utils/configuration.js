import config from 'config.json'
import { WALLET_PROVIDER } from 'integrations/constants'

export const isTournament = () => config.interface.tournament

export const getLogoPath = () => {
  if (isTournament() && !config.interface?.logoPath) {
    return '../../assets/img/placeholder.svg'
  }

  if (!isTournament()) {
    return '../../assets/img/gnosis_logo.svg'
  }

  return config.interface?.logoPath
}

export const getSmallLogoPath = () => {
  if (isTournament() && !config.interface?.logoPath) {
    return '../../assets/img/placeholder.svg'
  }

  if (!isTournament()) {
    return '../../assets/img/gnosis_logo_icon.svg'
  }

  return config.interface?.smallLogoPath
}

export const shallShowScoreboard = () =>
  (isTournament() && !!config.interface?.showScoreboard) ||
  (typeof config.interface?.showScoreboard === 'undefined' && isTournament())

export const shallShowGameGuide = () => isTournament() && !!config.interface?.gameGuide?.display

export const getGameGuideType = () => config.interface?.gameGuide?.type

export const getGameGuideURL = () => config.interface?.gameGuide?.url

export const shallDisplayFooter = () => !!config.interface?.footer?.display

export const getFooterContent = () => config.interface?.footer?.content

export const getTokenAddress = () => config.interface?.tokenContract

export const getRegistrationContractAddress = () => config.interface?.registrationContract

export const getProvider = () => config.interface?.provider

export const getUportOptions = () => config.interface?.uportOptions

export const getTermsOfUseURL = () => config.interface?.termsOfUse?.url

export const shouldUseMetamask = () => isTournament() && getProvider() === WALLET_PROVIDER.METAMASK

export const shouldUseUport = () => isTournament() && getProvider() === WALLET_PROVIDER.UPORT

export const getTournamentName = () => config.interface?.tournamentName

export const getTokenIcon = () => config.interface?.tokenIcon
