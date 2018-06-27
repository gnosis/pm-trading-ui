import { Map, List } from 'immutable'

export const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

export default store => next => (action) => {
  const { type } = action

  if (type !== 'INIT') return next(action)

  try {
    // eslint-disable-next-line
    const storedState = JSON.parse(window.localStorage.getItem(`GNOSIS_${process.env.VERSION}`))

    if (storedState) {
      // FIX-ME: Temporary to remember ToS Acceptance
      storedState.integrations = Map({
        documentsAccepted: List(storedState.integrations?.documentsAccepted),
      })

      store.dispatch({
        type: LOAD_LOCALSTORAGE,
        payload: storedState,
      })
    }
  } catch (e) {
    console.error(e.message)
  }

  return next(action)
}
