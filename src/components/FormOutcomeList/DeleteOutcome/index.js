import React from 'react'
import PropTypes from 'prop-types'

const DeleteOutcome = ({ text, onClick, index }) => (
  <a className="entry__delete" href="" tabIndex="-1" data-index={index} onClick={onClick}>
    {text}
  </a>
)

DeleteOutcome.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  index: PropTypes.number,
}

export default DeleteOutcome
