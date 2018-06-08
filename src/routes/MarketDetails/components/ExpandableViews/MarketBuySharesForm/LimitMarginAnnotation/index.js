import React from 'react'
import cn from 'classnames/bind'
import style from '../marketBuySharesForm.mod.scss'

const cx = cn.bind(style)

const LimitMarginAnnotation = () => (
  <div className={cx('row', 'infoRow', 'limitMarginAnnotation')}>
    <div className={cx('col-md-12')}>
      <span>The actual cost you will pay might be less by 5% depending on the market price at the time of trading</span>
    </div>
  </div>
)

export default LimitMarginAnnotation
