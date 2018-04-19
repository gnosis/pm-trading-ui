import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import Form from './Form'

import css from './Filter.mod.scss'

const cx = classNames.bind(css)

const MarketsFilter = ({ userAccount }) => (
  <div className={cx('filter')}>
    <Form userAccount={userAccount} />
  </div>
)

MarketsFilter.propTypes = {
  userAccount: PropTypes.string,
}

MarketsFilter.defaultProps = {
  userAccount: undefined,
}

export default MarketsFilter
