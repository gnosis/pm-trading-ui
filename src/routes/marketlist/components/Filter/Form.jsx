import React from 'react'
import { reduxForm, Field } from 'redux-form'

import {
  TextInput,
  Select,
  RadioButtonGroup,
} from 'components/Form'

export const MARKETFILTER_FORM_NAME = 'MARKETLIST_FORM'

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
    label: 'Creation Date (Ascending)',
    value: { key: 'creation', dir: 'asc' },
  },
  {
    label: 'Creation Date (Descending)',
    value: { key: 'creation', dir: 'desc' },
  },
]

const MARKETFILTER_STATUS_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Open Markets',
    value: { key: 'stage', value: 1 },
  },
  {
    label: 'Closed Markets',
    value: { key: 'isClosed', value: true },
  },
]

const Form = () => (
  <form>
    <Field label="Search" name="query" component={TextInput} placeholder="Title, Description, Keywords" />
    <Field label="Sort By" name="sortby" component={Select} options={MARKETFILTER_SELECT_OPTIONS} />
    <Field label="Marketstatus" name="status" component={RadioButtonGroup} options={MARKETFILTER_STATUS_OPTIONS} light />
  </form>
)

export default reduxForm({
  form: MARKETFILTER_FORM_NAME,
})(Form)
