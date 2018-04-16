import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import ScoreTable from './ScoreTable'
import style from './Table.mod.scss'

const cx = cn.bind(style)

const Table = ({ data, myAccount }) => (
  <Block>
    <ScoreTable tableData={data} myAccount={myAccount} />
    {myAccount && (
      <Block className={cx('ol-account')}>
        <Block className={cx('dot')} />
        <Paragraph className={cx('your')}>= YOUR ACCOUNT</Paragraph>
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
  myAccount: PropTypes.string,
}

Table.defaultProps = {
  data: [],
  myAccount: '',
}

export default Table
