import React from 'react'

export default ({ components, selected, props }) => {
  if (!selected) {
    return (
      <div className="expandable expandable--closed" />
    )
  }

  const ExpandingComponent = components[selected]

  return (
    <div className="expandable">
      <div className="container">
        <ExpandingComponent {...props} />
      </div>
    </div>
  )
}
