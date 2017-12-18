import React from 'react'
import PropTypes from 'prop-types'

const List = ({ children }) => (
  <ul className="menuAccountAction__list">
    {children}
  </ul>
)

List.propTypes = {
  children: PropTypes.node.isRequired,
}

export default List
