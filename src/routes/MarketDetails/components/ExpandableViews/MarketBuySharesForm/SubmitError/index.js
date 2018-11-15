import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import style from '../marketBuySharesForm.scss'

const cx = cn.bind(style)

const SubmitError = ({ t }) => (
  <div className={cx('row', 'infoRow')}>
    <div className={cx('col-md-12')}>
      {t('market.submit_error')}
    </div>
  </div>
)

SubmitError.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(SubmitError)
