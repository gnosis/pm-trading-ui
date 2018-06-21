import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { marketShape } from 'utils/shapes'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { decimalToText } from 'components/DecimalValue'
import style from './Infos.mod.scss'

const cx = cn.bind(style)

const Infos = ({
  market, defaultAccount, moderators, collateralTokenSymbol,
}) => {
  const marketInfos = {
    Token: collateralTokenSymbol || <IndefiniteSpinner width={20} height={20} />,
    Fee: `${decimalToText(market.fee, 2) / 10000} %`,
    Funding: (
      <span>
        {decimalToText(Decimal(market.funding).div(1e18))}{' '}
        {collateralTokenSymbol || (
          <span style={{ position: 'relative', bottom: -4 }}>
            <IndefiniteSpinner width={20} height={20} />
          </span>
        )}
      </span>
    ),
    'Trading Volume': (
      <span>
        {decimalToText(Decimal(market.volume).div(1e18))}{' '}
        {collateralTokenSymbol || (
          <span style={{ position: 'relative', bottom: -4 }}>
            <IndefiniteSpinner width={20} height={20} />
          </span>
        )}
      </span>
    ),
  }

  if (moderators[defaultAccount]) {
    // Show creator String
    marketInfos.creator = moderators[market.creator] || market.creator
  }

  return (
    <div className={cx('marketInfoСontainer', 'col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0')}>
      {Object.keys(marketInfos).map(label => (
        <div key={label}>
          <p className={cx('infoText', 'value')}>{marketInfos[label]}</p>
          <p className={cx('infoText', 'label')}>{label}</p>
        </div>
      ))}
    </div>
  )
}

Infos.propTypes = {
  market: marketShape.isRequired,
  defaultAccount: PropTypes.string,
  moderators: PropTypes.objectOf(PropTypes.string),
  collateralTokenSymbol: PropTypes.string.isRequired,
}

Infos.defaultProps = {
  defaultAccount: '',
  moderators: {},
}

export default Infos
