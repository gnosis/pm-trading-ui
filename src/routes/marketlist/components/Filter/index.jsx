import React from 'react'
import classNames from 'classnames/bind'

import Form from './Form.jsx'

import css from '../Filter.mod.scss'

const cx = classNames.bind(css)

const MarketsFilter = ({ userAccount }) => (
  <div className={cx('filter')}>
    <Form userAccount={userAccount} />
  </div>
)

export default MarketsFilter
