export const hasTrust = () => window && typeof window.web3 !== 'undefined' && !!window.web3.currentProvider.isTrust
