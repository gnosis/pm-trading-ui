import React from 'react'
import Responsive from 'react-responsive'

const Desktop = props => <Responsive {...props} minWidth={992} />
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />
const Mobile = props => <Responsive {...props} maxWidth={767} />

export { Desktop, Tablet, Mobile }
