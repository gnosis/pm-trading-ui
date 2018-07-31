import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isConnectedToBlockchain } from 'store/selectors/blockchain'
import { closeModal } from 'store/actions/modal'
import * as modals from 'containers/Modals'
import style from './backdrop.mod.scss'

const cx = cn.bind(style)

class BackdropProvider extends Component {
  renderBackdropContent() {
    const { modal, closeModal: closeModalProp, blockchainConnection } = this.props
    const isOpen = modal.get('isOpen', false)
    const currentModal = modal.get('currentModal')
    const transactions = modal.get('transactions', [])

    if (isOpen && blockchainConnection) {
      /*
       * Implement more modals here by adding to components/ModalContent
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
      modal,
      blockchainConnection,
    } = this.props
    const isOpen = modal.get('isOpen', false)

    return (
      <div>
        {children}
        {isOpen && blockchainConnection && (
          <div>
            <div className={cx('below')} />
            <div className={cx('above')}>
              {this.renderBackdropContent()}
            </div>
          </div>
        )}
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
  blockchainConnection: isConnectedToBlockchain(state),
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackdropProvider))
