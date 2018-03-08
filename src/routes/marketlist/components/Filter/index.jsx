import React from 'react'
import classNames from 'classnames/bind'

import Form from './Form.jsx'

import css from '../Filter.mod.scss'

const cx = classNames.bind(css)

const MarketsFilter = () => (
  <div className={cx('filter')}>
    <Form />
  </div>
)

export default MarketsFilter
