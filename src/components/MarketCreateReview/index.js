import React, { Component } from 'react'

import './marketCreateReview.less'

class MarketCreateReview extends Component {

  renderMarketDetails() {
    return (
      <div className="marketDetails">
        <div className="row">
          <div className="col-md-2">
            <div className="marketReviewHeading marketReviewHeading__checkmark">
              <div className="marketReviewHeading__icon icon icon--checkmark" />
            </div>
          </div>
          <div className="col-md-10">
            <h2 className="marketReviewHeading marketReviewHeading__title">Test</h2>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="marketCreateReviewPage">
        <div className="marketCreateReviewPage__header">
          <div className="container">
            <h1>Review Market</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {this.renderMarketDetails()}
            </div>
            <div className="col-md-4">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MarketCreateReview
