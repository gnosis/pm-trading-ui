import React from 'react'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

import style from './style.scss'

const cx = classnames.bind(style)

const Holdings = ({
  component: Component, holdings, title, emptyContent, keyParam, ...props
}) => (
  <div className={cx('holding')}>
    <h2 className={cx('holding-title')}>{title}</h2>
    {holdings.size === 0 && (
      <div className={cx('holding-emptyContent')}>
        {emptyContent}
      </div>
    )}
    {holdings.map(holding => <Component key={holding[keyParam]} {...(holding.toJS())} {...props} />)}
  </div>
)

Holdings.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  holdings: PropTypes.instanceOf(List),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  emptyContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  keyParam: PropTypes.string,
}

Holdings.defaultProps = {
  holdings: List(),
  title: '/',
  keyParam: 'id',
  emptyContent: '',
}

export default Holdings

export { default as Share } from './Share'
export { default as Trade } from './Trade'
