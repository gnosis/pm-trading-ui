import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import 'react-table/react-table.css'
import * as React from 'react'
import ReactTable from 'react-table'
import { snakeCase } from 'lodash'
import { isFeatureEnabled } from 'utils/features'
import {
  badgeCell, rankCell, olyCell, rewardCell, userAddressCell, ownTrCallback, ownTheadCallback,
} from './table'

const rewardsEnabled = isFeatureEnabled('rewards')
const badgesEnabled = isFeatureEnabled('badges')

const tableStyle = {
  border: 'none',
}

const headerStyle = {
  backgroundColor: '#EBEBEB',
  border: 'none',
  lineHeight: '42px',
  fontWeight: 'bold',
  padding: 0,
}

const headerLeft = {
  ...headerStyle,
  textAlign: 'left',
  paddingLeft: '5px',
}

const columnStyle = {
  textAlign: 'center',
  border: 'none',
  borderBottom: '1px solid #C5C5C5',
  lineHeight: '33px',
  fontFamily: 'Montserrat',
  fontSize: '14px',
  color: '#626262',
}

const columnBold = {
  ...columnStyle,
  fontWeight: '500',
}

const columns = [
  {
    Header: '#', // scoreboard.table.current_rank
    id: 'currentRank',
    accessor: 'currentRank',
    headerStyle,
    style: { ...columnBold, color: '#000000' },
    width: 50,
  },
  {
    Header: 'Change (24h)',
    accessor: 'diffRank',
    id: 'diffRank', // scoreboard.table.diff_rank
    Cell: rankCell,
    headerStyle,
    style: columnBold,
    width: 110,
  },
  {
    Header: 'User',
    accessor: 'account', // scoreboard.table.account
    headerStyle: headerLeft,
    style: { ...columnStyle, textAlign: 'left' },
    width: 150,
    Cell: userAddressCell,
  },
  {
    Header: 'Total Score (OLY)',
    accessor: 'score', // scoreboard.table.score
    headerStyle,
    style: { ...columnBold, color: '#000000', letterSpacing: '0.5px' },
    Cell: olyCell('score'),
  },
  {
    Header: 'Total Balance (OLY)',
    accessor: 'balance', // scoreboard.table.balance
    headerStyle,
    style: columnStyle,
    Cell: olyCell('balance'),
  },
  {
    Header: 'Predicted Profits (OLY)',
    accessor: 'predictedProfit', // scoreboard.table.predicted_profit
    headerStyle,
    style: columnStyle,
    Cell: olyCell('predictedProfit'),
  },
]

const EmptyData = () => <div />

const ScoreTable = ({
  tableData, myAccount, collateralToken, t,
}) => {
  const size = tableData ? tableData.size : 0

  const tableColumns = [...columns.map(column => ({
    ...column,
    Header: t(`scoreboard.table.${snakeCase(column.accessor)}`, { tokenSymbol: collateralToken.symbol }),
  }))]
  if (badgesEnabled) {
    tableColumns.push({
      Header: t('scoreboard.table.badge'),
      accessor: 'predictions',
      id: 'predictions',
      Cell: badgeCell,
      headerStyle,
      style: columnStyle,
    })
  }
  if (rewardsEnabled) {
    tableColumns.push({
      Header: t('scoreboard.table.reward'),
      accesor: 'currentRank',
      id: 'reward',
      headerStyle,
      style: columnStyle,
      Cell: rewardCell,
    })
  }

  return (
    <ReactTable
      key={size}
      data={tableData}
      columns={tableColumns}
      showPagination={false}
      defaultPageSize={size}
      style={tableStyle}
      getTrProps={ownTrCallback(myAccount)}
      getTheadProps={ownTheadCallback}
      sortable={false}
      NoDataComponent={EmptyData}
    />
  )
}

const dataType = ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
  currentRank: PropTypes.number.isRequired,
  diffRank: PropTypes.number.isRequired,
  pastRank: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  predictedProfit: PropTypes.string.isRequired,
  predictions: PropTypes.string.number,
}))

ReactTable.propTypes = {
  data: dataType,
}

ScoreTable.propTypes = {
  tableData: dataType,
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
  myAccount: PropTypes.string,
}

ScoreTable.defaultProps = {
  tableData: [],
  myAccount: 'Unknown',
}

export default withNamespaces()(ScoreTable)
