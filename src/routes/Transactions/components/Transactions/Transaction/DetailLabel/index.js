import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import moment from 'moment'
import { RESOLUTION_TIME } from 'utils/constants'
import style from './DetailLabel.mod.scss'

const cx = cn.bind(style)

const DetailLabel = ({ label, date, children }) => (
  <div>
    <div className={cx('detailLabel')}>{label}</div>
    {children || moment(date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
  </div>
)

DetailLabel.propTypes = {
  label: PropTypes.string,
  date: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

DetailLabel.defaultProps = {
  label: <div />,
  date: undefined,
  children: undefined,
}

export default DetailLabel
