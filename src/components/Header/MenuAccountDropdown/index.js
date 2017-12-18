import React from 'react'

import Tooltip from 'rc-tooltip'

import MenuActions from './MenuActions'

import './dropdown.less'

const MenuAccountDropdown = () => (
  <Tooltip
    placement="bottomRight"
    overlayClassName="menuAccountDropdown"
    overlay={<MenuActions />}
    align={{
      offset: ['10%', 20],
    }}
    trigger={['click']}
  >
    <div className="menuAccountDropdown">
      <div className="menuAccountDropdown__arrow" />
    </div>
  </Tooltip>
)

export default MenuAccountDropdown
