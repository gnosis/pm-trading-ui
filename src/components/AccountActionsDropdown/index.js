import React from 'react'

import Tooltip from 'rc-tooltip'

import './dropdown.less'


const AccountActionsDropdown = handleLogout => (
  <Tooltip
    placement="bottomRight"
    overlayClassName="accountActions"
  >
    <div className="accountActionsDropdown">
      <div className="accountActionsDropdown__arrow" />
    </div>
  </Tooltip>
)

export default AccountActionsDropdown
