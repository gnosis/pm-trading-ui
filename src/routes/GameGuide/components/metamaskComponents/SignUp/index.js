import React from 'react'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'
import Img from 'components/layout/Img'
import ConnectWalletScreenshot from 'routes/GameGuide/assets/connectWallet.png'
import RegisterWalletScreenshot from 'routes/GameGuide/assets/registerWallet.png'
import style from './SignUp.mod.scss'

const cx = cn.bind(style)

const SignUp = () => (
  <Block margin="md">
    <Subtitle>Sign-up</Subtitle>
    <Paragraph>
      To participate in our monthly tournament, you will need to verify your identity by signing up via Metamask on the
      Rinkeby network, and registering your Metamask address on Olympia.
      <br />
      <br />
      <Bold>1. </Bold>Make sure Metamask is installed on your browser:{' '}
      <a className={cx('link')} href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        https://metamask.io/
      </a>
      <br />
      <Bold>2. </Bold>Unlock Metamask and select the Rinkeby network<br />
      <Bold>3. </Bold>Head to{' '}
      <a className={cx('link')} href="https://olympia.gnosis.pm/" target="_blank" rel="noopener noreferrer">
        https://olympia.gnosis.pm/{' '}
      </a>and click on “Connect a Wallet”
      <br />
      <br />
      <Img src={ConnectWalletScreenshot} />
      <br />
      <br />
      <Bold>4. </Bold>Register your Metamask wallet address on Rinkeby when you see the following pop-up:
      <br />
      <br />
      <Img src={RegisterWalletScreenshot} />
      <br />
      <br />
      To cover the gas costs for this transaction, you will need Rinkeby ETH which you can get from the official Rinkeby
      faucet:{' '}
      <a className={cx('link')} href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">
        https://faucet.rinkeby.io/
      </a>{' '}
      Please note that this transaction is processed on Rinkeby and thus will not cost you real money. You will also
      need Rinkeby ETH to power all transactions you initiate on Olympia.
      <br />
      <br />
      Once your wallet address is registered with Olympia, you will receive your first 200 OLY tokens and get full
      access to trading on Olympia markets. OLY is the official play-money token issued for the Olympia tournament.
      <br />
      <br />
      <Bold>Important note: </Bold>
      The Metamask wallet address you register on Olympia is the same wallet address that will be used to claim GNO
      rewards on the mainnet at the end of the Olympia tournament. You will not be able to change this wallet address
      after the initial sign up, and you will not be able to claim your rewards on a different wallet address. The
      scoreboard shows your registered account and ranking, and will give you the option to claim your rewards once the
      tournament is over.
    </Paragraph>
  </Block>
)

export default SignUp
