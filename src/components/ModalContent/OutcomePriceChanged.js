import React from 'react'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import style from './TransactionsExplanation/TransactionExplanation.scss'

const cx = cn.bind(style)

const OutcomePriceChanged = ({ closeModal, t }) => (
  <div className={cx('transactionsExplanation')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <h3>
      {t('warning.price_changed')}
    </h3>
  </div>
)

OutcomePriceChanged.propTypes = {
  closeModal: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(OutcomePriceChanged)
