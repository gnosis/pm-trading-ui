import React from 'react'
import PropTypes from 'prop-types'

const hairlineStyle = {
  width: '100%',
  height: '2px',
  backgroundColor: '#f0f1f1',
  marginBottom: '20px',
}

const Hairline = ({ style = hairlineStyle }) => (
  <div style={style} />
)

Hairline.propTypes = {
  style: PropTypes.object,
}

Hairline.defaultProps = {
  style: undefined,
}

export default Hairline
