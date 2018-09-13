import React from 'react'
import PropTypes from 'prop-types'
import Form from './Form'

const MarketsFilter = ({ userAccount }) => (
  <div>
    <Form userAccount={userAccount} />
  </div>
)

MarketsFilter.propTypes = {
  userAccount: PropTypes.string,
}

MarketsFilter.defaultProps = {
  userAccount: undefined,
}

export default MarketsFilter
