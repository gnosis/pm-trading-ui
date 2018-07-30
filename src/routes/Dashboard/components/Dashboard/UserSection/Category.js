import React from 'react'
import PropTypes from 'prop-types'

import IndefiniteSpinner from 'components/Spinner/Indefinite'

import classnames from 'classnames/bind'
import styles from './Category.mod.scss'

const cx = classnames.bind(styles)

const Category = ({ children, className, isLoading }) => (
  <div className={cx('category', className)}>
    {isLoading ? <IndefiniteSpinner inverted centered /> : children}
  </div>
)

Category.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  isLoading: PropTypes.bool,
}

Category.defaultProps = {
  className: '',
  isLoading: false,
}

export default Category
