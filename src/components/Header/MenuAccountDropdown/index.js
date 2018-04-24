import React from 'react'
import Tooltip from 'rc-tooltip'
import cn from 'classnames/bind'
import MenuActions from './MenuActions'
import style from './dropdown.scss'

const cx = cn.bind(style)

const MenuAccountDropdown = () => (
  <Tooltip
    placement="bottomRight"
    overlayClassName={cx('menuAccountDropdown')}
    overlay={<MenuActions />}
    align={{
      offset: ['10%', 20],
    }}
    trigger={['click']}
  >
    <div className={cx('menuAccountDropdown')}>
      <div className={cx('arrow')} />
    </div>
  </Tooltip>
)

export default MenuAccountDropdown
