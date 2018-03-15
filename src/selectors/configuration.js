import config from 'config.json'

export const isTournament = () => config.interface.tournament

export const getLogoPath = () => {
  if (isTournament() && !config.interface.logoPath) {
    return '../../assets/img/placeholder.svg'
  }

  if (!isTournament()) {
    return '../../assets/img/gnosis_logo.svg'
  }

  return config.interface.logoPath
}

export const getSmallLogoPath = () => {
  if (isTournament() && !config.interface.logoPath) {
    return '../../assets/img/placeholder.svg'
  }

  if (!isTournament()) {
    return '../../assets/img/gnosis_logo_icon.svg'
  }

  return config.interface.smallLogoPath
}
