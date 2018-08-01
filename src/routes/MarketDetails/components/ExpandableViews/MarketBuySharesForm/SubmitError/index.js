import React from 'react'
import cn from 'classnames/bind'
import style from '../marketBuySharesForm.scss'

const cx = cn.bind(style)

const SubmitError = () => (
  <div className={cx('row', 'infoRow')}>
    <div className={cx('col-md-12')}>
      Sorry - your investment couldn&apos;t be processed. Please ensure you&apos;re on the right network.
    </div>
  </div>
)

export default SubmitError
