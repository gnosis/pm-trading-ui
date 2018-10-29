export const hasMetamask = () => window
  && typeof window.web3 !== 'undefined'
  && (window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider' || window.web3.currentProvider.isMetaMask)
