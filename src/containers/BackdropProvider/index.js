import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isFeatureEnabled } from 'utils/features'
import { triedToConnect } from 'store/selectors/blockchain'
import { closeModal } from 'store/actions/modal'
import * as modals from 'containers/Modals'
import style from './backdrop.mod.scss'

const cx = cn.bind(style)

const tournamentEnabled = isFeatureEnabled('tournament')

class BackdropProvider extends Component {
  renderBackdropContent() {
    const { modal, closeModal: closeModalProp, blockchainConnection } = this.props
    const isOpen = modal.get('isOpen', false)
    const currentModal = modal.get('currentModal')
    const transactions = modal.get('transactions', [])

    if (isOpen && blockchainConnection) {
      /*
       * Implement more modals here by adding to components/modals.js
       */
      const Modal = modals[currentModal]

      if (!Modal) {
        throw Error('Invalid Modal Type', currentModal)
      }

      return <Modal transactions={transactions} closeModal={closeModalProp} />
    }

    return undefined
  }

  render() {
    const {
      children,
      modal: { isOpen },
      blockchainConnection,
    } = this.props
    return (
      <div>
        <div
          className={cx({
            filter: true,
            visible: isOpen && blockchainConnection,
          })}
        >
          {isOpen && blockchainConnection ? (
            <div style={{ position: 'fixed', minWidth: '100vw' }}>{children}</div>
          ) : (
            children
          )}
        </div>
        <div className={cx('above', { tournament: tournamentEnabled })}>{this.renderBackdropContent()}</div>
      </div>
    )
  }
}

BackdropProvider.propTypes = {
  modal: PropTypes.shape({
    isOpen: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
  blockchainConnection: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  modal: state.modal,
  blockchainConnection: triedToConnect(state),
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackdropProvider))
