import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import styles from './OutcomeColorBox.scss'

const cx = cn.bind(styles)

const OutcomeColorBox = ({ style }) => <div className={cx('OutcomeColorBox')} style={style} />

OutcomeColorBox.propTypes = {
  style: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
}

OutcomeColorBox.defaultProps = {
  style: {
    backgroundColor: '#fff',
  },
}

export default OutcomeColorBox
