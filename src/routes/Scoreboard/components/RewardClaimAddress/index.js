import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import LoadingIndicator from 'components/Spinner/Indefinite'

import Block from 'components/layout/Block'
import AddressSection from './AddressSection'
import CheckboxIcon from '../../assets/ok.svg'

import * as css from './RewardClaim.mod.scss'

const cx = classNames.bind(css)

const LoadingSection = () => (
  <Block className={cx('loadingSection')}>
    <LoadingIndicator />
  </Block>
)

const RewardClaimAddress = ({ mainnetAddress, openSetMainnetAddressModal }) => {
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

RewardClaimAddress.propTypes = {
  mainnetAddress: PropTypes.string,
  openSetMainnetAddressModal: PropTypes.func.isRequired,
}

RewardClaimAddress.defaultProps = {
  mainnetAddress: undefined,
  hasRegistered: undefined,
}

export default RewardClaimAddress
