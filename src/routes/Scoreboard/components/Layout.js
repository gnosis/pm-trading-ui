import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import Hairline from 'components/layout/Hairline'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { getProvider } from 'utils/configuration'
import { WALLET_PROVIDER } from 'integrations/constants'
import * as React from 'react'
import * as css from './index.mod.scss'
import ScoreTable from './ScoreTable'
import RewardClaimAddress from './RewardClaimAddress'
import ClaimReward from './ClaimReward'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

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

const NoRows = () => <Paragraph className={cx('norows')}>No rows found</Paragraph>

class Layout extends React.PureComponent {
  render() {
    const {
      data, myAccount, mainnetAddress, openSetMainnetAddressModal,
    } = this.props
    const hasRows = data && data.size > 1
    const showRewardClaim = getProvider() === WALLET_PROVIDER.METAMASK ? !!mainnetAddress : myAccount

    return (
      <Block>
        <PageFrame>
          {showRewardClaim && (
            <Block className={cx('rewardContainer')}>
              <RewardClaimAddress
                mainnetAddress={mainnetAddress}
                openSetMainnetAddressModal={openSetMainnetAddressModal}
              />
              <ClaimReward />
            </Block>
          )}
          {showRewardClaim && <Hairline />}
          <Block className={cx('trophy')}>
            <Img src={trophy} width="100" />
            <Paragraph>Scoreboard</Paragraph>
          </Block>
          <Paragraph className={cx('explanation')}>
            The total score is calculated based on the sum of predicted profits and OLY tokens each wallet holds. Scores
            are updated every hour.
          </Paragraph>
          {hasRows ? <Table data={data} myAccount={myAccount} /> : <NoRows />}
          <Block margin="xl" />
        </PageFrame>
      </Block>
    )
  }
}

const types = {
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
  openSetMainnetAddressModal: PropTypes.func,
  myAccount: PropTypes.string,
  mainnetAddress: PropTypes.string,
}

const defaultProps = {
  data: [],
  openSetMainnetAddressModal: () => {},
  myAccount: '',
  mainnetAddress: undefined,
}

Layout.propTypes = types
Layout.defaultProps = defaultProps
Table.propTypes = types
Table.defaultProps = defaultProps

export default Layout
