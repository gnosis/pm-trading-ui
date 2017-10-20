import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'

import { closeModal } from 'actions/modal'

import * as modals from 'containers/modals'

import './backdrop.less'

class BackdropProvider extends Component {
  renderBackdropContent() {
    const { modal: { currentModal, isOpen, ...data }, closeModal: closeModalProp } = this.props

    if (isOpen) {
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
    const { children, modal: { isOpen } } = this.props
    return (
      <div className="backdrop">
        <div
          className={cn({
            backdrop__filter: true,
            'backdrop__filter--visible': isOpen,
          })}
        >
          {isOpen ? <div style={{ position: 'fixed', minWidth: '100vw' }}>{children}</div> : children}
        </div>
        <div className="backdrop__above">{this.renderBackdropContent()}</div>
      </div>
    )
  }
}

BackdropProvider.propTypes = {
  modal: PropTypes.shape({
    isOpen: PropTypes.bool,
  }),
  children: PropTypes.node,
  closeModal: PropTypes.func,
}

const mapStateToProps = state => ({
  modal: state.modal,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
})
export default connect(mapStateToProps, mapDispatchToProps)(BackdropProvider)
