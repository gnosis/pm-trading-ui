import React, { Component } from 'react'
import { connect } from 'react-redux'

import withWalletIntegration from 'containers/WalletIntegrationContainer'
import EventOverview from 'components/EventOverview'

const walletApi = withWalletIntegration(EventOverview)
export default connect()(walletApi)
