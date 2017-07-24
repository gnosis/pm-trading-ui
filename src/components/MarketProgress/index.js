import React, { Component } from 'react'
import moment from 'moment'

import './marketProgress.less'

class MarketProgress extends Component {
  render() {
    const { progress, logs, success, transaction: { startTime, endTime } } = this.props
    const strokeDasharray = Math.abs((progress) - 1) * Math.PI * (190 * 2)

    const timeDiff = (startTime && endTime) ? moment(startTime).to(moment(endTime), true) : undefined
    console.log(this.props)
    return (
      <div className="marketProgress">
        <a className="marketProgress__close" href="javascript:void(0);" onClick={() => this.props.closeModal()} ></a>
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
                {logs.map((log, index) => (
                  <div className={`marketProgress__logItem ${log.isDone ? '' : 'marketProgress__logItem--running'}`} key={index}>
                    {log.label}
                  </div>
                  ))}
                  <div className="marketProgress__logItem">Done</div>
                  <div className="marketProgress__logItem">Doooone</div>
                  <div className="marketProgress__logItem marketProgress__logItem--running">Creating everything</div>
                  <div className="marketProgress__logItem marketProgress__logItem--running">oh yes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MarketProgress
