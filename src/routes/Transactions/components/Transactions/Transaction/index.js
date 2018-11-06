import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Icon from 'components/Icon'
import TransactionSpinner from 'components/Spinner/Transaction'
import moment from 'moment'
import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'
import DetailLabel from './DetailLabel'
import style from '../Transactions.scss'

const cx = cn.bind(style)

const completionMessages = {
  [TRANSACTION_COMPLETE_STATUS.NO_ERROR]: 'Transaction finished successfully',
  [TRANSACTION_COMPLETE_STATUS.ERROR]: 'Transaction did not finish, errors occured',
  [TRANSACTION_COMPLETE_STATUS.TIMEOUT]: 'Transaction timed out',
  [TRANSACTION_COMPLETE_STATUS.LOST]: 'Because of a page reload, we lost the status of this Transaction',
}

const detailIconStyle = {
  marginRight: 7,
}

const Transaction = ({
  label, startTime, endTime, completed, completionStatus, progress,
}) => (
  <div className={cx('transaction')}>
    <TransactionSpinner completed={completed} completionStatus={completionStatus} progress={progress} />
    <div className={cx('content')}>
      <div className={cx('heading')}>{label}</div>
      <div className={cx('details')}>
        <div className={cx('detail')}>
          <Icon type="new" size={32} style={detailIconStyle} />
          <DetailLabel label="Created at" date={startTime} />
        </div>
        {endTime && (
          <div className={cx('detail')}>
            <Icon type="enddate" size={32} style={detailIconStyle} />
            <DetailLabel label="Finished at" date={endTime} />
          </div>
        )}
        {endTime && (
          <div className={cx('detail')}>
            <Icon type="countdown" size={32} style={detailIconStyle} />
            <DetailLabel label="Transaction Time">
              {`took ${moment(endTime).from(moment(startTime), true)}`}
            </DetailLabel>
          </div>
        )}
      </div>
      {completed && <div className={cx('message')}>{completionMessages[completionStatus]}</div>}
    </div>
  </div>
)

Transaction.propTypes = {
  label: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  completed: PropTypes.bool,
  completionStatus: PropTypes.string,
  progress: PropTypes.number,
}

Transaction.defaultProps = {
  label: 'Unknown Transaction',
  startTime: undefined,
  endTime: undefined,
  completed: false,
  completionStatus: undefined,
  progress: 0,
}

export default Transaction
