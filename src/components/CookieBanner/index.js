import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import CSSTransition from 'react-transition-group/CSSTransition'
import { getCookie, setCookie } from './utils'
import style from './style.scss'

const cx = cn.bind(style)

class CookieBanner extends Component {
  state = {
    shown: false,
  }

  componentDidMount() {
    const { display, options } = this.props

    const noCookiesSet = !options.filter(({ label }) => getCookie(label) !== '').length
    const shouldShow = display || noCookiesSet

    if (shouldShow) {
      this.setState({ shown: true })
    }
  }

  @autobind
  handleClose() {
    this.setState({
      shown: false,
    })
  }

  @autobind
  handleOptionClick() {}

  render() {
    const { options, selected } = this.props
    const { shown } = this.state

    const animationClassNames = {
      enter: cx('float-enter'),
      enterActive: cx('float-enter-active'),
      exit: cx('float-exit'),
      exitActive: cx('float-exit-active'),
    }

    return (
      <CSSTransition in={shown} classNames={animationClassNames} timeout={300} unmountOnExit>
        <div className={cx('cookieBar')}>
          <p>
            We use cookies to give you the best experience and to help improve our website. Please read our{' '}
            <a href="/cookies">Cookie Policy</a> for more information. By clicking &quot;Accept Cookies,&quot; you agree
            to the storing of cookies on your device to enhance site navigation and analyze site usage.
          </p>
          <div className={cx('settings')}>
            <span className={cx('options')}>
              {options.map(({ label }) => (
                <div key={label} className={cx('checkbox')}>
                  <input name={label} type="checkbox" checked={selected.indexOf(label) > -1} />
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
      </CSSTransition>
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