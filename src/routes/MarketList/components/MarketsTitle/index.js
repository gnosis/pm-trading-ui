import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames/bind'

import css from './MarketsTitle.scss'

const cx = classNames.bind(css)

const MarketListTitle = ({ t }) => (
  <div className={cx('marketListTitle')}>
    <div className="container">
      <h1>{t('markets.list_title')}</h1>
    </div>
  </div>
)

MarketListTitle.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(MarketListTitle)
