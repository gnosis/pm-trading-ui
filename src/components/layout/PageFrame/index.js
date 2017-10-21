import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const PageFrame = ({ children }) =>
    <Block className={ cx('pageFrame') }>
        { children }
    </Block>

export default PageFrame
