import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import style from './style.scss'

const cx = cn.bind(style)

const CookieBanner = () => (
  <div className={cx('cookieBar')}>
    <p>
      We use cookies to give you the best experience and to help improve our website. Please read our{' '}
      <a href="/cookies">Cookie Policy</a> for more information. By clicking &quot;Accept Cookies,&quot; you agree to
      the storing of cookies on your device to enhance site navigation and analyze site usage.
    </p>
    <div className={cx('settings')}>
      <span className={cx('options')}>
        <div className={cx('checkbox')}>
          <input id="cb-1" name="neccesary" type="checkbox" />
          <label htmlFor="cb-1">Intercom</label>
        </div>
        <div className={cx('checkbox')}>
          <input id="cb-2" name="analytics" type="checkbox" />
          <label htmlFor="cb-2">Analytics</label>
        </div>
      </span>
      <button type="button" id="{config.banner.accept_button}" className={cx('button', 'accept')}>
        Accept Cookies
      </button>
    </div>
  </div>
)

CookieBanner.propTypes = {}

CookieBanner.defaultProps = {}

export default CookieBanner
