import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'

import Icon from 'components/Icon'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'

const BadgeIcon = ({ userTournamentInfo: { predictions = 0 } }) => {
  const badge = badgeOf(predictions)

  if (!badge) {
    return null
  }

  return (
    <Tooltip placement="left" overlay={badge.rank}>
      <Icon src={badge.icon} size={42} style={{ marginLeft: 8 }} />
    </Tooltip>
  )
}

BadgeIcon.propTypes = {
  userTournamentInfo: PropTypes.shape({
    predictions: PropTypes.number,
  }),
}

BadgeIcon.defaultProps = {
  userTournamentInfo: {},
}

export default BadgeIcon
