import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import Title from 'components/layout/Title'
import style from './AddressSection.mod.scss'

const cx = cn.bind(style)

const AddressSection = ({ hasRegistered, mainnetAddress, openSetMainnetAddressModal }) => (
  <Block className={cx('addressSection')}>
    <Title className={cx('rewardClaimTitle')}>Your Reward Claim Address</Title>
    <Paragraph>{hasRegistered ? mainnetAddress : 'No address specified yet.'}</Paragraph>
    {!hasRegistered && <button onClick={openSetMainnetAddressModal}>Setup claim address</button>}
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

export default AddressSection
