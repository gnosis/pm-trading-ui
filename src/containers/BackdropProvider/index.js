import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as modals from 'components/modals'

class BackdropProvider extends Component {
  renderBackdropContent() {
    const { currentModal, isOpen } = this.props
    
    if (isOpen) {
      const Modal = modals[currentModal]

      return <Modal />
    }
  }

  render() {
    const { isOpen, children } = this.props
    return (
      <div className="backdrop">
        <div className={`backdrop__filter ${isOpen ? 'backdrop__filter--visible' : ''}`}>
          {children}
        </div>
        <div className="backdrop__above">
          {this.renderBackdropContent()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentModal: state.modal.currentModal,
    isOpen: state.modal.isOpen,
  }
}

export default connect(mapStateToProps)(BackdropProvider)
