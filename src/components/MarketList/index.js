import React, { Component } from 'react'
import { Link } from 'react-router'
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

  renderMarkets() {
    const { markets } = this.props
    
    if (markets.length > 0) {
      const marketList = markets.map((market) => {
        const timeUntilEvent = moment
          .duration(moment(market.resolutionDate)
          .diff())

        return (
          <div className="market" key={market.address}>
            <div className="market__field market__field--header">
              <Link to={`markets/${market.address}`}>{ market.title }</Link>
            </div>
            <div className="market__field market__field--liveTime">
              {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_FORMAT)}
            </div>
            <div className="market__field market__field--creator">{market.marketCreator}</div>
            <div className="market__field market__field--oracle">{market.oracleOwner}</div>
            <div className="market__field market__field--resolutionDate">
              {moment(market.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
          </div>
        )
      })

      return <div className="marketList col-xs-10">{marketList}</div>
    }
    return (
      <div className="marketList col-xs-10">
        <div className="market">No Markets available</div>
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
        <div className="row">
          <div className="marketOverview col-xs-12">
            <h1>Marketoverview</h1>
            <p>Here you can see all the markets!</p>

            <div className="marketStats">
              <p className="marketStats__stat">{ markets.length } markets open</p>
              <p className="marketStats__stat">{ markets.length } closing soon</p>
              <p className="marketStats__stat">{ markets.length } new (since last visit)</p>
            </div>
          </div>
          { this.renderMarkets() }
          { this.renderMarketFilter() }
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'marketList',
  onChange: (values, dispatch) => {
    dispatch(submit('marketList'))
  },
  onSubmit: () => {
  }
})(MarketList)
