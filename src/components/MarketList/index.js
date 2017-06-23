import React, { Component } from 'react'
import { Link } from 'react-router'
import autobind from 'autobind-decorator'
import moment from 'moment'
import 'moment-duration-format'
import { reduxForm, submit, Field } from 'redux-form'

import SelectLabeled from 'components/SelectLabeled'

import './marketList.less'

import { RESOLUTION_TIME } from 'utils/constants'

class MarketList extends Component {
  componentWillMount() {
    this.props.requestMarkets()
  }

  renderMarket(market) {
    const timeUntilEvent = moment
      .duration(moment(market.resolutionDate)
      .diff())

      let isResolved = timeUntilEvent < 0

    return (
      <button type="button" className="market" key={market.address}>
        <div className="market__header">
          <h1 className="market__title">{ market.title }</h1>
          <div className="market__control">
            <Link to={`/markets/${market.address}/resolve`}>Resolve</Link>
          </div>
        </div>
        <div className="market__outcomes" />
        <div className="market__info row">
          {isResolved ? (
            <div className="info__group col-xs-3">
              <div className="info_icon" />
              <div className="info_field">Resolved</div>
            </div>
          ) : (
            <div className="info__group col-xs-3">
              <div className="info__icon" />
              <div className="info__field">
                {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_FORMAT)}
              </div>
            </div>
          )}
          <div className="info__group col-xs-3">
            <div className="info__icon" />
            <div className="info__field">
              {moment(market.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
          </div>
          <div className="info__group col-xs-3">
            <div className="info__icon" />
            <div className="info__field">
              {market.oracleAddress}
            </div>
          </div>
          <div className="info__group col-xs-3">
            <div className="info__icon" />
            <div className="info__field">
              {market.collateralToken}
            </div>
          </div>
        </div>
      </button>
    )
  }

  renderMarkets() {
    const { markets } = this.props

    if (markets.length > 0) {
      return (
        <div className="marketList col-xs-10">
          <div className="marketList__title">Showing {markets.length} of {markets.length}</div>
          <div className="marketListContainer">
            {markets.map(this.renderMarket)}
          </div>
        </div>
      )
    }
    return (
      <div className="marketList col-xs-10">
        <div className="marketListContainer">
          <div className="market">No Markets available</div>
        </div>
      </div>
    )
  }

  renderMarketFilter() {
    const { handleSubmit } = this.props

    return (
      <div className="marketFilter col-xs-2">
        <form onSubmit={handleSubmit}>
          <div className="marketFilter__group">
            <Field
              component={SelectLabeled}
              name="preset"
              label="Preset"
              labelClassName="marketFilter__label"
              className="marketFilter__input"
              defaultValue={'none'}
              values={{ none: 'None' }}
            />
          </div>
          <div className="marketFilter__group">
            <Field
              component={SelectLabeled}
              name="oracle"
              label="Oracle"
              labelClassName="marketFilter__label"
              className="marketFilter__input"
              defaultValue={'CENTRALIZED'}
              values={{ CENTRALIZED: 'Centralized', ULTIMATE: 'Ultimate' }}
            />
          </div>
        </form>
      </div>
    )
  }

  render() {
    const { markets } = this.props
    return (
      <div className="marketListPage">
        <div className="marketListPage__header">
          <div className="container">
            <h1>Marketoverview</h1>
          </div>
        </div>
        <div className="marketListPage__stats">
          <div className="container">
            <div className="row">
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Open Markets</div>
              </div>
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Closing Soon</div>
              </div>
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">New Markets</div>
              </div>
              <div className="col-xs-3">
                <button type="button" className="marketStats__control btn btn-primary">Create Market</button>
              </div>
            </div>
          </div>
        </div>
        <div className="marketListPage__markets">
          <div className="container">
            <div className="row">
              { this.renderMarkets() }
              { this.renderMarketFilter() }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'marketListFilter',
  onChange: (values, dispatch) => {
    dispatch(submit('marketListFilter'))
  },
  onSubmit: () => {
  },
})(MarketList)
