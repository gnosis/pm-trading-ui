const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'

export default store => next => action => {
  const state = store.getState()

  if (action.type !== CLEAR_LOCAL_STORAGE) {
    // eslint-disable-next-line
    localStorage.setItem(`AURATIKUM_${__VERSION__}`, JSON.stringify({
      authentication: state.authentication,
    }))

    return next(action)
  }
  next(action)
}
