import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from 'rc-tooltip'

import './dropdown.less'

const generateActionsList = actions => (
  <ul className="accountActions__list">
    {actions.map(({ label, action, icon }) => (
      <li key={label} className="accountActions__action">
        <button type="button" onClick={() => action()}>
          {icon && <i className={`icon icon--${icon}`} />} {label}
        </button>
      </li>
    ))}
    <li className="accountActions__seperator"></li>
  </ul>
)

const AccountActionsDropdown = ({ onLogout }) => (
  <Tooltip
    placement="bottomRight"
    overlayClassName="accountActions"
    overlay={generateActionsList([
      { label: 'Logout', action: onLogout, icon: 'logout' },
    ])}
    align={{
      offset: ['15%', 20]
    }}
    trigger={['click']}
  >
    <div className="accountActionsDropdown">
      <div className="accountActionsDropdown__arrow" />
    </div>
  </Tooltip>
)

AccountActionsDropdown.propTypes = {
  onLogout: PropTypes.func.isRequired,
}

export default AccountActionsDropdown
