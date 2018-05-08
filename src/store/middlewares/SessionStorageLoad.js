export const LOAD_SESSIONSTORAGE = 'LOAD_SESSIONSTORAGE'

export default store => next => (action) => {
  const { type } = action

  if (type !== 'INIT') return next(action)

  try {
    const storedState = JSON.parse(window.sessionStorage.getItem(`GNOSIS_${process.env.VERSION}`))
    if (storedState) {
      store.dispatch({
        type: LOAD_SESSIONSTORAGE,
        payload: storedState,
      })
    }

    return next(action)
  } catch (e) {
    console.error(e.message)
  }

  return null
}
