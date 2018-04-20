import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import css from './Labeled.mod.scss'

const cx = classNames.bind(css)

const LabeledSpinner = ({
  width,
  height,
  progress,
  modifier,
  showLabel,
  label,
  strokeWidthPx,
  fontSizePx,
  showBar,
  minBarSize,
}) => {
  const size = Math.min(width, height)
  const r = size / 2 - strokeWidthPx
  const d = r * 2
  const strokeDashoffset = Math.abs(Math.max(progress, minBarSize / 100) - 1) * Math.PI * d

  const wrapperStyle = { width: `${width}px`, height: `${height}px` }

  return (
    <div className={cx('labeledSpinner', modifier)} style={wrapperStyle}>
      <svg className={cx('svg')} width={width} height={width}>
        <defs>
          <linearGradient id="ProgressSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00a6c4" />
            <stop offset="46%" stopColor="#05bdc4" />
            <stop offset="100%" stopColor="#0adcc4" />
          </linearGradient>
        </defs>
        <circle
          className={cx('inner')}
          r={r}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={d * Math.PI}
          strokeDashoffset="0"
          strokeWidth={strokeWidthPx}
        />
        {showBar && (
          <circle
            className={cx('bar')}
            r={r}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            strokeDasharray={d * Math.PI}
            strokeDashoffset={strokeDashoffset}
            stroke="url(#ProgressSpinnerGradient)"
            strokeWidth={strokeWidthPx}
          />
        )}
      </svg>
      <div className={cx('labelWrapper')}>
        {showLabel && (
          <span className={cx('label')} style={{ fontSize: `${fontSizePx}px` }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

LabeledSpinner.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  progress: PropTypes.number,
  modifier: PropTypes.string,
  showLabel: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  strokeWidthPx: PropTypes.number,
  fontSizePx: PropTypes.number,
  showBar: PropTypes.bool,
  minBarSize: PropTypes.number,
}

LabeledSpinner.defaultProps = {
  progress: 0,
  modifier: '',
  showLabel: false,
  label: undefined,
  strokeWidthPx: 10,
  fontSizePx: 42,
  showBar: true,
  minBarSize: 0,
}

export default LabeledSpinner
