import classNames from 'classnames/bind'
import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import * as css from '../index.css'

const login1 = require('routes/gamerules/assets/login1.png')
const login2 = require('routes/gamerules/assets/login2.png')
const login3 = require('routes/gamerules/assets/login3.png')
const login4 = require('routes/gamerules/assets/login4.png')

const cx = classNames.bind(css)

const LogIn = () => (
  <Block margin="xl">
    <Subtitle>Log-in</Subtitle>
    <Paragraph color="medium">
      Once the tournament starts, you will be able to access Olympia at http://olympia.gnosis.pm. <br />
      <br />
      To log in, select Continue via uPort, scan the QR code with your installed uPort app by heading to the camera icon
      in the very top left, and accept the login request.
    </Paragraph>
    <Block>
      <Block className={cx('slider')}>
        <Img src={login1} bordered />
        <Img src={login2} bordered />
      </Block>
      <Block className={cx('slider')}>
        <Img src={login3} width={350} height={622} bordered />
        <Img src={login4} width={350} height={622} bordered />
      </Block>
    </Block>
  </Block>
)

export default LogIn
