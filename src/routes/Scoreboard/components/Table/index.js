import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import { List } from 'immutable'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import ScoreTable from './ScoreTable'
import style from './Table.scss'

const cx = cn.bind(style)

const Table = ({
  data, myAccount, collateralToken, t,
}) => (
  <Block>
    <ScoreTable tableData={data} myAccount={myAccount} collateralToken={collateralToken} />
    {myAccount && (
      <Block className={cx('ol-account')}>
        <Block className={cx('dot')} />
        <Paragraph className={cx('your')}>{t('scoreboard.your_account')}</Paragraph>
      </Block>
    )}
  </Block>
)

Table.propTypes = {
  data: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
    currentRank: PropTypes.number.isRequired,
    diffRank: PropTypes.number.isRequired,
    pastRank: PropTypes.number.isRequired,
    account: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    predictedProfit: PropTypes.string.isRequired,
    predictions: PropTypes.string.number,
  })),
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
  myAccount: PropTypes.string,
  t: PropTypes.func.isRequired,
}

Table.defaultProps = {
  data: List(),
  myAccount: '',
}

export default withNamespaces()(Table)
