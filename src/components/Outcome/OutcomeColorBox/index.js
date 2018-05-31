import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'

import { COLOR_SCHEME_DEFAULT, COLOR_SCHEME_SCALAR, OUTCOME_TYPES } from 'utils/constants'

import styles from './OutcomeColorBox.mod.scss'

const cx = cn.bind(styles)

const COLOR_SCHEMES = {
  [OUTCOME_TYPES.SCALAR]: COLOR_SCHEME_SCALAR,
  [OUTCOME_TYPES.CATEGORICAL]: COLOR_SCHEME_DEFAULT,
}

const OutcomeColorBox = ({ outcomeIndex, scheme }) => (<div className={cx('OutcomeColorBox')} style={{ backgroundColor: COLOR_SCHEMES[scheme][outcomeIndex] }} />)

OutcomeColorBox.propTypes = {
  outcomeIndex: PropTypes.number.isRequired,
  scheme: PropTypes.string,
}

OutcomeColorBox.defaultProps = {
  scheme: OUTCOME_TYPES.CATEGORICAL,
}

export default OutcomeColorBox
