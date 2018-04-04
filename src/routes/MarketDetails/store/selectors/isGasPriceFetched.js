const isGasPriceFetched = state => state.blockchain.get('gasPrice') !== undefined

export default isGasPriceFetched
