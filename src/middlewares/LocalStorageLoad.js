import { Map, List } from 'immutable'
import { set } from 'lodash'

export const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

export default store => next => (action) => {
  const { type } = action

  if (type !== 'INIT') return next(action)

  try {
    const storedState = JSON.parse(
      // eslint-disable-next-line
      window.localStorage.getItem(`GNOSIS_${process.env.VERSION}`))

    if (storedState) {
      // FIX-ME: Temporary to remember ToS Acceptance
      storedState.integrations = Map({
        termsAndConditionsAccepted: List(storedState.integrations.termsAndConditionsAccepted),
      })

      store.dispatch({
        type: LOAD_LOCALSTORAGE,
        payload: storedState,
      })
    }

    return next(action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }

  return null
}
