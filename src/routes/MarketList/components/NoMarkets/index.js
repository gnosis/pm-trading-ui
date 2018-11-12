import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

const NoMarkets = ({ t }) => (
  <div>
    <p>{t('markets.no_markets')}</p>
  </div>
)

NoMarkets.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(NoMarkets)
