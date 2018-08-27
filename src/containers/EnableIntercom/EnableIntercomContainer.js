import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import Tooltip from 'rc-tooltip'
import { connect } from 'react-redux'
import { changeUiState } from 'store/actions/interface'
import Icon from 'components/Icon'
import style from './EnableIntercom.scss'

const cx = cn.bind(style)

class EnableIntercom extends Component {
  @autobind
  handleOnClick() {
    const { openCookieBanner, closeIntercomReminder } = this.props
    openCookieBanner()
    closeIntercomReminder()
  }

  render() {
    const iconStyles = {
      backgroundSize: 'cover',
      cursor: 'pointer',
    }

    return (
      <div className={cx('container')}>
        <Tooltip overlay="Accept Chat Support cookies to enable chat support" placement="left">
          <Icon type="intercom" size={60} style={iconStyles} onClick={this.handleOnClick} />
        </Tooltip>
      </div>
    )
  }
}

EnableIntercom.propTypes = {
  openCookieBanner: PropTypes.func.isRequired,
  closeIntercomReminder: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  openCookieBanner: () => dispatch(changeUiState({ showCookieBanner: true })),
  closeIntercomReminder: () => dispatch(changeUiState({ showIntercomReminder: false })),
})

export default connect(
  null,
  mapDispatchToProps,
)(EnableIntercom)
