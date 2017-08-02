export default store => next => (action) => {
  const { type } = action

  if (type !== 'INIT') return next(action)

  try {
    const storedState = JSON.parse(
      // eslint-disable-next-line
      window.localStorage.getItem(`AURATIKUM_${__VERSION__}`)
    )
    if (storedState) {
      store.dispatch({
        type: 'LOAD_LOCALSTORAGE',
        payload: storedState,
      })
    }

    return next(action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }
}
