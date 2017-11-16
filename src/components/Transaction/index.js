import React from 'react'
import PropTypes from 'prop-types'
import ProgressIndicator from 'components/ProgressIndicator'
import moment from 'moment'

import { RESOLUTION_TIME, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

const completionMessages = {
  [TRANSACTION_COMPLETE_STATUS.NO_ERROR]: 'Transaction finished successfully',
  [TRANSACTION_COMPLETE_STATUS.ERROR]: 'Transaction did not finish, errors occured',
  [TRANSACTION_COMPLETE_STATUS.TIMEOUT]: 'Transaction timed out',
  [TRANSACTION_COMPLETE_STATUS.LOST]: 'Because of a page reload, we lost the status of this Transaction',
}

const Transaction = ({ label, startTime, endTime, completed, completionStatus, progress, type }) => (
  <div className={`transactionsPage__transaction transactionsPage__transaction--${type} transaction`}>
    <ProgressIndicator completed={completed} completionStatus={completionStatus} progress={progress} />
    <div className="transaction__content">
      <div className="transaction__heading">{label}</div>
      <div className="transaction__details">
        <div className="transaction__detail">
          <div className="icon icon--new" />
          <div className="transaction__detailLabel">Created at</div>
          {moment(startTime).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </div>
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--enddate" />
            <div className="transaction__detailLabel">Finished at</div>
            {moment(endTime).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
          </div>
        )}
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--countdown" />
            <div className="transaction__detailLabel">Transaction Time</div>
            {`took ${moment(endTime).from(moment(startTime), true)}`}
          </div>
        )}
      </div>
      {completed && <div className="transaction__message">{completionMessages[completionStatus]}</div>}
    </div>
  </div>
)

Transaction.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  completed: PropTypes.bool,
  completionStatus: PropTypes.string,
  progress: PropTypes.number,
  type: PropTypes.string,
}

export default Transaction
