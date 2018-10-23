import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { withState } from 'recompose'
import { marketShape } from 'utils/shapes'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { decimalToText } from 'components/DecimalValue'
import Icon from 'components/Icon'
import Tooltip from 'rc-tooltip'
import { Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import style from './Infos.scss'

import generateEmbeddingCode from './utils/embeddedLink'

const NOOP = (e) => { e.preventDefault() }

const cx = cn.bind(style)

const Infos = ({
  market, defaultAccount, moderators, collateralTokenSymbol, hasCopied, setHasCopied,
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

  const embeddingCode = generateEmbeddingCode(market.address)
  const marketUrl = `${window.location.origin}/markets/${market.address}`
  const embeddingUrl = `${window.location.origin}/embedded/${market.address}`

  return (
    <div className={cx('marketInfoСontainer', 'col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0')}>
      {Object.keys(marketInfos).map(label => (
        <div key={label}>
          <p className={cx('infoText', 'value')}>{marketInfos[label]}</p>
          <p className={cx('infoText', 'label')}>{label}</p>
        </div>
      ))}
      <div>
        <Tooltip
          trigger="click"
          onVisibleChange={visible => visible && setHasCopied(false)}
          placement="bottom"
          overlay={(
            <div>
              <ul className={cx('share', 'list')}>
                <li>
                  {hasCopied === 'market' ? <strong>Copied to Clipboard!</strong> : (
                    <CopyToClipboard text={marketUrl} onCopy={() => setHasCopied('market')}>
                      <a onClick={NOOP} href={marketUrl} rel="noreferrer noopener" target="_blank">Link to Market</a>
                    </CopyToClipboard>
                  )}
                </li>
                <li>
                  {hasCopied === 'embedded' ? <strong>Copied to Clipboard!</strong> : (
                    <CopyToClipboard text={embeddingCode} onCopy={() => setHasCopied('embedded')}>
                      <a onClick={NOOP} href={embeddingUrl} rel="noreferrer noopener" target="_blank">Embedding Code</a>
                    </CopyToClipboard>
                  )}
                </li>
              </ul>
            </div>
          )}
        >
          <button className={cx('btn', 'btn-link', 'sharebutton')} type="button"><Icon type="share" size={16} /> Share</button>
        </Tooltip>
      </div>
    </div>
  )
}

Infos.propTypes = {
  market: marketShape.isRequired,
  defaultAccount: PropTypes.string,
  moderators: PropTypes.objectOf(PropTypes.string),
  collateralTokenSymbol: PropTypes.string.isRequired,
  hasCopied: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  setHasCopied: PropTypes.func.isRequired,
}

Infos.defaultProps = {
  defaultAccount: '',
  moderators: {},
}

export default withState('hasCopied', 'setHasCopied', false)(Infos)
