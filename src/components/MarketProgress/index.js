import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './marketProgress.less'

const MarketProgress = ({
  progress,
  logs,
  success,
  transaction: { startTime, endTime },
  closeModal,
}) => {
  const strokeDasharray = Math.abs((progress) - 1) * Math.PI * (190 * 2)

  const timeDiff = (startTime && endTime) ? moment(startTime).to(moment(endTime), true) : undefined

  return (
    <div className="marketProgress">
      {/* eslint-disable no-script-url */}
      <a className="marketProgress__close" href="javascript:void(0);" onClick={() => closeModal()}>&nbsp;</a>
      {/* eslint-enable no-script-url */}
      <div className="container">
        <div className="marketProgress__header">
          {
            success ? 'Market Creation successful' : 'Market Creation in Progress'
          }
        </div>
        <div className="marketProgress__disclaimer">
          {
            success ?
              `Your Market was created successfully. ${timeDiff ? `It took ${timeDiff}.` : ''}` :
              'It will take some time until all required Smart Contracts have been created. You will be notified after all Smart Contracts have been created. You can leave this page if you want.'
          }
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className={`radialProgressBar ${success ? 'radialProgressBar--success' : ''}`}>
              <svg id="marketProgress__svg" width="400" height="400">
                <defs>
                  <linearGradient id="gnosisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00a6c4" />
                    <stop offset="46%" stopColor="#05bdc4" />
                    <stop offset="100%" stopColor="#0adcc4" />
                  </linearGradient>
                </defs>
                <circle id="inner" r="190" cx="200" cy="200" fill="transparent" strokeDasharray="1193.8052" strokeDashoffset="0" />
                <circle id="bar" r="190" cx="200" cy="200" fill="transparent" strokeDasharray="1193.8052" strokeDashoffset={strokeDasharray} stroke="url(#gnosisGradient)" />
              </svg>
              <div className="radialProgressBar__label">{Math.ceil(progress * 100)}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="marketProgress__logs">
              {logs.length > 0 ?
                logs.map((log, index) => {
                  const isLastRunning =
                    (!log.isDone && logs[index - 1] && logs[index - 1].isDone) ||
                    (index === 0 && !log.isDone)

                  return (
                    <div className={`marketProgress__logItem ${log.isDone ? '' : 'marketProgress__logItem--running'} ${isLastRunning ? 'marketProgress__logItem--currentActive' : ''}`} key={index}>
                      {log.label}
                    </div>
                  )
                })
                : <div className="marketProgress__logItem">Starting Transactions</div>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

MarketProgress.propTypes = {
  progress: PropTypes.number,
  logs: PropTypes.arrayOf(PropTypes.shape({
    isDone: PropTypes.bool,
    label: PropTypes.string,
  })),
  success: PropTypes.string,
  transaction: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
  closeModal: PropTypes.string,
}

export default MarketProgress
