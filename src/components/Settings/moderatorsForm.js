import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Field } from 'redux-form'
import Input from 'components/FormInput'

export default class ModeratorsForm extends Component {

  constructor() {
    super()
    this.state = { active: false, moderators: [] }
  }

  @autobind
  _handleOnToggle(event) {
    //event.preventDefault()
    // show / hide form

    if (this.state.active) {
      // clean fields
      this.props.array.removeAll('display_name')
      this.props.array.removeAll('moderator_address')
    }
    // update state
    this.setState({ active: !this.state.active })
  }

  @autobind
  _handleOnChange(event, value) {
    console.log(value)
    console.log(this.displayName.value)

  }

  @autobind
  _handleOnAddModerator(event) {
    // save new moderator
    let state = {...this.state}
    state.moderators.push({
      displayName: this.displayName.value,
      moderatorAddress: this.moderatorAddress.value
    })
    this.setState(state)
    console.log(state)
  }

  _renderForm() {
    return (
      <div className="settings__form">
        <h3>Moderators</h3>
        {
          !this.state.active ?
            <div className="row">
              <div className="col-md-offset-2 col-md-4">
                <button
                  className="btn btn-default btn-default--muted"
                  type="button"
                  onClick={this._handleOnToggle}
                >
                ADD MODERATOR
                </button>
              </div>
            </div>
          : <div />
        }
        {
          this.state.active ?
            <form ref={(f) => { this.moderatorsForm = f }} id="moderators_form" onSubmit={this._handleOnAddModerator}>
              <div className="row">
                <div className="col-md-offset-2 col-md-10">
                  <Field name="display_name" id="display_name" component={Input}
                    ref={(input) => this.displayName = input}
                    onChange={this._handleOnChange} type="text" label="Display Name" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-offset-2 col-md-10">
                  <Field name="moderator_address" id="moderator_address" component={Input}
                    ref={(input) => this.moderatorAddress = input}
                    onChange={this._handleOnChange} type="text" label="Address" />
                </div>
              </div>
              <button
                className="btn btn-default btn-default--muted"
                type="button"
                onClick={this._handleOnAddModerator}>
                SAVE
              </button>
              <button
                className="btn btn-default btn-default--muted"
                type="button"
                onClick={this._handleOnToggle}>
                CANCEL
              </button>
            </form>

          : <div />
        }
        {
          this.state.moderators ? this.state.moderators.map(
            (displayName, moderatorAddress) => {
              <h4>TEST{displayName}</h4>
            }
          ) : <div />
        }
      </div>
    )
  }

  render() {
    return (this._renderForm())
  }

}
