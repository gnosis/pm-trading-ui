import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isTournament } from 'utils/configuration'
import { triedToConnect } from 'selectors/blockchain'
import { closeModal } from 'actions/modal'
import * as modals from 'containers/Modals'

import './backdrop.scss'

class BackdropProvider extends Component {
  renderBackdropContent() {
    const { modal: { currentModal, isOpen, ...data }, closeModal: closeModalProp, blockchainConnection } = this.props

    if (isOpen && blockchainConnection) {
      /*
       * Implement more modals here by adding to components/modals.js
       */
      const Modal = modals[currentModal]

      if (!Modal) {
        throw Error('Invalid Modal Type', currentModal)
      }

      return <Modal {...data} closeModal={closeModalProp} />
    }

    return undefined
  }

  render() {
    const { children, modal: { isOpen }, blockchainConnection } = this.props
    const tournament = isTournament()
    return (
      <div className="backdrop">
        <div
          className={cn({
            backdrop__filter: true,
            'backdrop__filter--visible': isOpen && blockchainConnection,
            tournament,
          })}
        >
          {isOpen && blockchainConnection ? <div style={{ position: 'fixed', minWidth: '100vw' }}>{children}</div> : children}
        </div>
        <div className={cn('backdrop__above', { tournament })}>{this.renderBackdropContent()}</div>
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
