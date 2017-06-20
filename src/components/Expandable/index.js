import React from 'react'

import './expandable.less'

export default ({ components, selected }) => {
  if (!selected) {
    return (
      <div className="expandable expandable--closed" />
    )
  }

  return (
    <div className="expandable">
      {components[selected]}
    </div>
  )
}
