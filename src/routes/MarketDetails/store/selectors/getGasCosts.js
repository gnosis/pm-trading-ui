const getGasCosts = (state) => {
  const gasCosts = state.blockchain.get('gasCosts')

  return gasCosts.map((cost) => {
    if (!cost) {
      return 0
    }

    return cost
  })
}

export default getGasCosts
