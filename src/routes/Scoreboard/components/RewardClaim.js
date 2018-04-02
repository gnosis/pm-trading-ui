import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { Link } from 'react-router'

import LoadingIndicator from 'components/Spinner/Indefinite'

import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import Title from 'components/layout/Title'
import CheckboxIcon from '../assets/ok.svg'

import * as css from './index.css'

const cx = classNames.bind(css)

const LoadingSection = () => (
  <Block className={cx('loadingSection')}>
    <LoadingIndicator />
  </Block>
)

const AddressSection = ({ hasRegistered, mainnetAddress, openSetMainnetAddressModal }) => (
  <Block className={cx('addressSection')}>
    <Title className={cx('rewardClaimTitle')}>Your Reward Claim Address</Title>
    <Paragraph className={cx('address')}>{hasRegistered ? mainnetAddress : 'No address specified yet.'}</Paragraph>
    {!hasRegistered && (
      <Link to="/scoreboard" href="/scoreboard" onClick={openSetMainnetAddressModal}>
        Setup claim address
      </Link>
    )}
  </Block>
)

AddressSection.propTypes = {
  openSetMainnetAddressModal: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
  hasRegistered: PropTypes.bool,
}

AddressSection.defaultProps = {
  hasRegistered: false,
  mainnetAddress: '',
}

const RewardClaim = ({ mainnetAddress, openSetMainnetAddressModal }) => {
  const showLoading = mainnetAddress === undefined
  const hasRegistered = parseInt(mainnetAddress, 16) > 0

  return (
    <Block className={cx('rewardClaim')}>
      <Block className={cx('iconSection')}>
        <img src={CheckboxIcon} alt="" />
      </Block>
      {showLoading ? (
        <LoadingSection />
      ) : (
        <AddressSection
          mainnetAddress={mainnetAddress}
          hasRegistered={hasRegistered}
          openSetMainnetAddressModal={openSetMainnetAddressModal}
        />
      )}
    </Block>
  )
}

RewardClaim.propTypes = {
  mainnetAddress: PropTypes.string,
  openSetMainnetAddressModal: PropTypes.func.isRequired,
}

RewardClaim.defaultProps = {
  mainnetAddress: undefined,
  hasRegistered: undefined,
}

export default RewardClaim
