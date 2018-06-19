import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import Hairline from 'components/layout/Hairline'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { getProviderConfig, isFeatureEnabled, getFeatureConfig } from 'utils/features'
import { WALLET_PROVIDER } from 'integrations/constants'
import * as React from 'react'
import * as css from './Layout.mod.scss'
import Table from './Table'
import RewardClaimAddress from './RewardClaimAddress'
import ClaimReward from './ClaimReward'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

const providerConfig = getProviderConfig()

const rewardsEnabled = isFeatureEnabled('rewards')
const { levels } = getFeatureConfig('rewards')

const NoRows = () => <Paragraph className={cx('norows')}>No rows found</Paragraph>

class Layout extends React.PureComponent {
  render() {
    const {
      data, myAccount, mainnetAddress, openSetMainnetAddressModal, openClaimRewardModal, rank,
    } = this.props
    const hasRows = data && data.size > 1
    let rewardValue = 0

    levels.forEach((rewardLevel) => {
      if (
        (rank >= rewardLevel.minRank && rank <= rewardLevel.maxRank) || // between min/max
        (rank >= rewardLevel.minRank && rewardLevel.maxRank == null) // above min
      ) {
        rewardValue = rewardLevel.value
      }
    })

    const showRewardInfo =
      rewardsEnabled && providerConfig.default === WALLET_PROVIDER.METAMASK ? !!mainnetAddress : myAccount
    const showRewardClaim = rewardsEnabled && providerConfig.default === WALLET_PROVIDER.METAMASK && !!mainnetAddress

    return (
      <Block>
        <PageFrame>
          {showRewardInfo && (
            <Block className={cx('rewardContainer')}>
              <RewardClaimAddress
                mainnetAddress={mainnetAddress}
                openSetMainnetAddressModal={openSetMainnetAddressModal}
              />
              {showRewardClaim && <ClaimReward openClaimRewardModal={openClaimRewardModal} rewardValue={rewardValue} />}
            </Block>
          )}
          {showRewardInfo && <Hairline />}
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

Layout.propTypes = {
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
  openSetMainnetAddressModal: PropTypes.func.isRequired,
  openClaimRewardModal: PropTypes.func.isRequired,
  myAccount: PropTypes.string,
  mainnetAddress: PropTypes.string,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Layout.defaultProps = {
  data: List(),
  myAccount: '',
  mainnetAddress: undefined,
  rank: '',
}

export default Layout
