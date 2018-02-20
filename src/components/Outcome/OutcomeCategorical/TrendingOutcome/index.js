import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import style from '../outcomeCategorical.scss'

const cx = cn.bind(style)

const TrendingOutcome = ({
  entryStyle, outcome, percentage, resolutionDate,
}) => (
  <div className="outcomes outcomes--categorical">
    <div className={cx('outcomeWrapper')}>
      <div className="entry__color" style={entryStyle} />
      <div className={cx('outcome')}>{outcome}</div>
    </div>
    <div>{percentage}%</div>
    <div className={cx('date')}>{resolutionDate}</div>
  </div>
)

TrendingOutcome.propTypes = {
  entryStyle: PropTypes.object,
  outcome: PropTypes.string,
  percentage: PropTypes.string,
  resolutionDate: PropTypes.string,
}

TrendingOutcome.defaultProps = {
  entryStyle: {},
  outcome: '',
  percentage: '',
  resolutionDate: '',
}

export default TrendingOutcome
