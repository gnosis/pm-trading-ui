import React from 'react'

export default ({ components, selected }) => {
  if (!selected) {
    return (
      <div className="expandable expandable--closed" />
    )
  }

  return (
    <div className="expandable">
      <div className="container">
        {components[selected]}
      </div>
    </div>
  )
}
