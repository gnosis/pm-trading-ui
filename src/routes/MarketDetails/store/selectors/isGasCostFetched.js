const isGasCostFetched = (state, property) => state.blockchain.getIn(['gasCosts', property]) !== undefined

export default isGasCostFetched
