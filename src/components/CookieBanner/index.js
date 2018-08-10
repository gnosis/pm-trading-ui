import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import style from './style.scss'

const cx = cn.bind(style)

class CookieBanner extends Component {
  state = {
    shouldHide: false,
    shouldShow: false,
  }

  componentDidMount() {
    const { display } = this.props
    if (display) {
      this.setState({ shouldShow: true })
    }
  }

  @autobind
  handleClose() {
    this.setState({
      shouldHide: true,
      shouldShow: false,
    })
  }

  render() {
    const { options, selected } = this.props
    const { shouldHide, shouldShow } = this.state

    return (
      <div className={cx('cookieBar', { shown: shouldShow }, { hidden: shouldHide })}>
        <p>
          We use cookies to give you the best experience and to help improve our website. Please read our{' '}
          <a href="/cookies">Cookie Policy</a> for more information. By clicking &quot;Accept Cookies,&quot; you agree
          to the storing of cookies on your device to enhance site navigation and analyze site usage.
        </p>
        <div className={cx('settings')}>
          <span className={cx('options')}>
            {options.map(({ label }) => (
              <div key={label} className={cx('checkbox')}>
                <input id="cb-1" name="neccesary" type="checkbox" checked={selected.indexOf(label) > -1} />
                <label htmlFor="cb-1">{label}</label>
              </div>
            ))}
          </span>
          <button type="button" id="{config.banner.accept_button}" className={cx('button', 'accept')}>
            Accept Cookies
          </button>
        </div>
        <div className={cx('closeButton')} onClick={this.handleClose} />
      </div>
    )
  }
}

CookieBanner.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      initFunc: PropTypes.func.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  display: PropTypes.bool,
}

CookieBanner.defaultProps = {
  selected: [],
  display: undefined,
}

export default CookieBanner
