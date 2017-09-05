const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'

export default store => next => (action) => {
  const state = store.getState()

  if (action.type !== CLEAR_LOCAL_STORAGE) {
    // eslint-disable-next-line no-undef
    localStorage.setItem(`GNOSIS${process.env.VERSION}`, JSON.stringify({
      transactions: state.transactions,
    }))

    return next(action)
  }
  next(action)
  return null
}
