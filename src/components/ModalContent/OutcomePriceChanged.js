import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import style from './TransactionsExplanation/TransactionExplanation.scss'

const cx = cn.bind(style)

const OutcomePriceChanged = ({ closeModal }) => (
  <div className={cx('transactionsExplanation')}>
    <div className={cx('closeButton')} onClick={closeModal} />
    <h3
      style={{
        color: '#fff',
      }}
    >
      The transaction could not be processed because the trading price changed. <br />
      Please check the new price and try again.
    </h3>
  </div>
)

OutcomePriceChanged.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default OutcomePriceChanged
