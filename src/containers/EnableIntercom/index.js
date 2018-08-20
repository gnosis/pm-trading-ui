import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import autobind from 'autobind-decorator'
import Tooltip from 'rc-tooltip'
import Cookies from 'js-cookies'
import { connect } from 'react-redux'
import { changeUiState } from 'store/actions/interface'
import { getUiState } from 'store/selectors/interface'
import Icon from 'components/Icon'
import style from './EnableIntercom.scss'

const cx = cn.bind(style)

class EnableIntercom extends Component {
  componentDidMount() {
    const { changeIntercomReminderVisibility } = this.props
    if (Cookies.get('Chat support') === 'no') {
      changeIntercomReminderVisibility(true)
    }
  }

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
          <Icon type="intercom" size={60} style={iconStyles} />
        </Tooltip>
      </div>
    )
  }
}

EnableIntercom.propTypes = {
  openCookieBanner: PropTypes.func.isRequired,
  closeIntercomReminder: PropTypes.func.isRequired,
  changeIntercomReminderVisibility: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  showIntercomReminder: getUiState(state, 'showIntercomReminder'),
})

const mapDispatchToProps = dispatch => ({
  openCookieBanner: () => dispatch(changeUiState({ showCookieBanner: true })),
  changeIntercomReminderVisibility: visible => dispatch(changeUiState({ showIntercomReminder: visible })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnableIntercom)
