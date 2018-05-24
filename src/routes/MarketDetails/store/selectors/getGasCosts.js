const getGasCosts = (state) => {
  const gasCosts = state.blockchain.get('gasCosts')

  return gasCosts.map((cost) => {
    if (!cost) {
      return undefined
    }

    return cost
  })
}

export default getGasCosts
