import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'

import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import style from '../outcomeCategorical.scss'

const cx = cn.bind(style)

const TrendingOutcomeCategorical = ({
  outcomeIndex, outcome, percentage, resolutionDate,
}) => (
  <div className={cx('trendingOutcomeCategoricalContainer')}>
    <div className={cx('outcomeWrapper')}>
      <OutcomeColorBox outcomeIndex={outcomeIndex} />
      <div className={cx('outcome')}>{outcome}</div>
    </div>
    &nbsp;
    <div>{percentage}%</div>
    <div className={cx('date')}>{resolutionDate}</div>
  </div>
)

TrendingOutcomeCategorical.propTypes = {
  outcomeIndex: PropTypes.number.isRequired,
  outcome: PropTypes.string,
  percentage: PropTypes.string,
  resolutionDate: PropTypes.string,
}

TrendingOutcomeCategorical.defaultProps = {
  outcome: '',
  percentage: '',
  resolutionDate: '',
}

export default TrendingOutcomeCategorical
