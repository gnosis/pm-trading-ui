import React from 'react'
import Tooltip from 'rc-tooltip'

import Icon from 'components/Icon'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'

const BadgeIcon = ({ userTournamentInfo }) => {
  let predictions = 12345

  if (userTournamentInfo) {
    [predictions] = userTournamentInfo
  }

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

export default BadgeIcon
