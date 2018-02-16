import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  logoutProvider,
} from 'integrations/store/actions'

const LogOut = ({ logout }) => (
  <li key="action-logout" className="menuAccountAction__action">
    <button type="button" onClick={() => logout()}>
      <i className="icon icon--logout" /> Logout
    </button>
  </li>
)

LogOut.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default connect(null, {
  logout: logoutProvider,
})(LogOut)
