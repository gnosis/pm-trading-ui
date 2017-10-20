const url = '';

export default (params) => (dispatch) =>
    restFetch(url)
        .then((response) => {
            if (!response) {
                return []
            }
            dispatch(addUsers(response));
        })
