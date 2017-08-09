import React from 'react'

import './progressSpinner.less'

const ProgressSpinner = ({ width, height, progress, modifier, showLabel, label, strokeWidth = 10 }) => {
  const size = Math.min(width, height)
  const r = (size / 2) - strokeWidth
  const d = r * 2
  const strokeDashoffset = Math.abs((progress) - 1) * Math.PI * d

  return (
    <div className={`progressSpinner ${modifier ? `progressSpinner--${modifier}` : ''}`}>
      <svg id="progressSpinner__svg" width={width} height={width}>
        <defs>
          <linearGradient id="ProgressSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00a6c4" />
            <stop offset="46%" stopColor="#05bdc4" />
            <stop offset="100%" stopColor="#0adcc4" />
          </linearGradient>
        </defs>
        <circle
          id="inner"
          r={r}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={d * Math.PI}
          strokeDashoffset="0"
          strokeWidth={strokeWidth}
        />
        <circle
          id="bar"
          r={r}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={d * Math.PI}
          strokeDashoffset={strokeDashoffset}
          stroke="url(#ProgressSpinnerGradient)"
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className="progressSpinner__label">{showLabel && label}</div>
    </div>
  )
}

export default ProgressSpinner
