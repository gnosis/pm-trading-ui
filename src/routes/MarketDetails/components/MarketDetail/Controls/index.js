import React from 'react'
import cn from 'classnames'
import expandableViews from 'routes/MarketDetails/components/ExpandableViews'
import { ReactRouterMatchShape } from 'utils/shapes'

const Controls = props => (
  <div className="marketControls container">
    <div className="row">
      {Object.keys(expandableViews)
        .filter(view =>
          typeof expandableViews[view].showCondition !== 'function' || expandableViews[view].showCondition(props))
        .map(view => (
          <button
            key={view}
            type="button"
            className={cn({
              marketControls__button: true,
              'marketControls__button--active btn btn-primary': view === props.match.params.view,
              [expandableViews[view].className]: view !== props.match.params.view,
            })}
            onClick={() => props.handleExpand(view)}
          >
            {expandableViews[view].label}
          </button>
        ))}
    </div>
  </div>
)

Controls.propTypes = {
  match: ReactRouterMatchShape,
}

Controls.defaultProps = {
  match: {
    params: {},
  },
}

export default Controls
