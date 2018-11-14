import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import style from '../marketMyTrades.scss'

const cx = cn.bind(style)

const TableHeader = ({ t }) => (
  <thead>
    <tr>
      <th className={cx('tableHeading', 'first')} />
      <th className={cx('tableHeading')}>{t('market.order_type')}</th>
      <th className={cx('tableHeading')}>{t('market.outcome')}</th>
      <th className={cx('tableHeading')}>{t('market.outcome_count')}</th>
      <th className={cx('tableHeading')}>{t('market.avg_price')}</th>
      <th className={cx('tableHeading')}>{t('market.date')}</th>
      <th className={cx('tableHeading')}>{t('market.cost')}</th>
    </tr>
  </thead>
)

TableHeader.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(TableHeader)
