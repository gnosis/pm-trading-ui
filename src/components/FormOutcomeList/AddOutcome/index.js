import React from 'react'
import PropTypes from 'prop-types'

const AddOutcome = ({ text, onClick }) => (
  <a href="" className="entry__add" onClick={onClick}>
    {text}
  </a>
)

AddOutcome.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
}

export default AddOutcome
