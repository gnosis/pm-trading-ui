import React from 'react'
import PropTypes from 'prop-types'
import TransactionSpinner from 'components/Spinner/Transaction'
import moment from 'moment'

import { RESOLUTION_TIME, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

const completionMessages = {
  [TRANSACTION_COMPLETE_STATUS.NO_ERROR]: 'Transaction finished successfully',
  [TRANSACTION_COMPLETE_STATUS.ERROR]: 'Transaction did not finish, errors occured',
  [TRANSACTION_COMPLETE_STATUS.TIMEOUT]: 'Transaction timed out',
  [TRANSACTION_COMPLETE_STATUS.LOST]: 'Because of a page reload, we lost the status of this Transaction',
}

const DetailLabel = ({ label, date, children }) => (
  <div>
    <div className="transaction__detailLabel">{label}</div>
    {children || moment(date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
  </div>
)

DetailLabel.propTypes = {
  label: PropTypes.string,
  date: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

DetailLabel.defaultProps = {
  label: <div />,
  date: undefined,
  children: undefined,
}

const Transaction = ({
  label, startTime, endTime, completed, completionStatus, progress, type,
}) => (
  <div className={`transactionsPage__transaction transactionsPage__transaction--${type} transaction`}>
    <TransactionSpinner completed={completed} completionStatus={completionStatus} progress={progress} />
    <div className="transaction__content">
      <div className="transaction__heading">{label}</div>
      <div className="transaction__details">
        <div className="transaction__detail">
          <div className="icon icon--new" />
          <DetailLabel label="Created at" date={startTime} />
        </div>
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--enddate" />
            <DetailLabel label="Finished at" date={endTime} />
          </div>
        )}
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--countdown" />
            <DetailLabel label="Transaction Time">
              { `took ${moment(endTime).from(moment(startTime), true)}` }
            </DetailLabel>
          </div>
        )}
      </div>
      {completed && <div className="transaction__message">{completionMessages[completionStatus]}</div>}
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
  type: PropTypes.string,
}

Transaction.defaultProps = {
  label: 'Unknown Transaction',
  startTime: undefined,
  endTime: undefined,
  completed: false,
  completionStatus: undefined,
  progress: 0,
  type: 'default',
}

export default Transaction
