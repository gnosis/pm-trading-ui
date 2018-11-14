import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import style from '../marketBuySharesForm.scss'

const cx = cn.bind(style)

const LimitMarginAnnotation = ({ t }) => (
  <div className={cx('row', 'infoRow', 'limitMarginAnnotation')}>
    <div className={cx('col-md-12')}>
      <span>{t('market.limit_margin_warning')}</span>
    </div>
  </div>
)

LimitMarginAnnotation.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(LimitMarginAnnotation)
