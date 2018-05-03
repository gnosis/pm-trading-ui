import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'

import {
  TextInput,
  Checkbox,
  Select,
  RadioButtonGroup,
} from 'components/Form'

export const MARKETFILTER_FORM_NAME = 'FormMARKETLIST_FORM'

const MARKETFILTER_SELECT_OPTIONS = [
  {
    label: 'Marketresolution (Ascending)',
    value: { key: 'resolution', dir: 'asc' },
  },
  {
    label: 'Marketresolution (Descending)',
    value: { key: 'resolution', dir: 'desc' },
  },
  {
    label: 'Trading Volume (Ascending)',
    value: { key: 'volume', dir: 'asc' },
  },
  {
    label: 'Trading Volume (Descending)',
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
    <Field label="Search" name="filterQuery" component={TextInput} placeholder=" timbo search --- Title, Description, Keywords" decoration="underlined" />
    <Field label="Sort By" name="sortBy" component={Select} options={MARKETFILTER_SELECT_OPTIONS} />
    <Field label="Marketstatus" name="filterByStatus" component={RadioButtonGroup} options={MARKETFILTER_STATUS_OPTIONS} light />
    {userAccount && (
      <Field label="Show Only" name="filterMyMarkets" component={Checkbox} light>My Markets</Field>
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
})(Form)
