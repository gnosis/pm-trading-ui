export const hasStatus = () => window && typeof window.web3 !== 'undefined' && !!window.web3.currentProvider.isStatus
