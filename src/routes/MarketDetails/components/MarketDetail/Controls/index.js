import React from 'react'
import cn from 'classnames/bind'
import expandableViews from 'routes/MarketDetails/components/ExpandableViews'
import { ReactRouterMatchShape } from 'utils/shapes'
import style from './Controls.mod.scss'

const cx = cn.bind(style)

const Controls = props => (
  <div className={cx('marketControls', 'controlsContainer', 'container')}>
    <div className={cx('row')}>
      {Object.keys(expandableViews)
        .filter(view =>
          typeof expandableViews[view].showCondition !== 'function' || expandableViews[view].showCondition(props))
        .map(view => (
          <button
            key={view}
            type="button"
            className={cx({
              button: true,
              'btn btn-primary': view === props.match.params.view,
              active: view === props.match.params.view,
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
