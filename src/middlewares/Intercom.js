export default store => next => (action) => {
    const handledAction = next(action)
  
    const { type } = action
  
    // only when we change again
    if (type === '@@router/LOCATION_CHANGE') {
        window.Intercom("update")
    }
  
    return handledAction
  }