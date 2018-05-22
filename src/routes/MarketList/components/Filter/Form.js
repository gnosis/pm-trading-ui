import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { TextInput, Checkbox, Select, RadioButtonGroup } from 'components/Form'

export const MARKETFILTER_FORM_NAME = 'MARKETLIST_FORM'

const MARKETFILTER_SELECT_OPTIONS = [
  {
    label: 'RESOLUTION DATE ↑',
    value: { key: 'resolution', dir: 'asc' },
  },
  {
    label: 'RESOLUTION DATE ↓',
    value: { key: 'resolution', dir: 'desc' },
  },
  {
    label: 'TRADING VOLUME ↑',
    value: { key: 'volume', dir: 'asc' },
  },
  {
    label: 'TRADING VOLUME ↓',
    value: { key: 'volume', dir: 'desc' },
  },
]

const MARKETFILTER_STATUS_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Open Markets',
    value: 'isOpen',
  },
  {
    label: 'Closed Markets',
    value: 'isClosed',
  },
]

const Form = ({ userAccount }) => (
  <form>
    <Field
      label="Search"
      name="filterQuery"
      component={TextInput}
      placeholder="Title, Description, Keywords"
      decoration="underlined"
    />
    <Field label="Sort By" name="sortBy" component={Select} options={MARKETFILTER_SELECT_OPTIONS} />
    <Field
      label="Market status"
      name="filterByStatus"
      component={RadioButtonGroup}
      options={MARKETFILTER_STATUS_OPTIONS}
      light
    />
    {userAccount && (
      <Field label="Show Only" name="filterMyMarkets" component={Checkbox} light>
        My Markets
      </Field>
    )}
  </form>
)

Form.propTypes = {
  userAccount: PropTypes.string,
}

Form.defaultProps = {
  userAccount: undefined,
}

export default reduxForm({
  form: MARKETFILTER_FORM_NAME,
  destroyOnUnmount: false,
})(Form)
