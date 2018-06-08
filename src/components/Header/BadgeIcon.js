import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Icon from 'components/Icon'
import { UserRecord } from 'routes/Scoreboard/store'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'

const BadgeIcon = ({ userTournamentInfo }) => {
  let predictionsAmount = 0

  if (userTournamentInfo) {
    predictionsAmount = userTournamentInfo.predictions
  }

  const badge = badgeOf(predictionsAmount)

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
  userTournamentInfo: ImmutablePropTypes.record,
}

BadgeIcon.defaultProps = {
  userTournamentInfo: new UserRecord(),
}

export default BadgeIcon
