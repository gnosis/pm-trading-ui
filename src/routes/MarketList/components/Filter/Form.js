import React from 'react'
import { reduxForm, Field } from 'redux-form'
import cn from 'classnames/bind'
import {
  TextInput, Select, RadioButtonGroup,
} from 'components/Form'
import style from './Filter.mod.scss'

const cx = cn.bind(style)

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

const Form = () => (
  <form>
    <Field
      label="Search"
      name="filterQuery"
      component={TextInput}
      placeholder="Title, Description, Keywords"
      decoration="underlined"
      className={cx('filterInput')}
    />
    <Field label="Sort By" name="sortBy" component={Select} options={MARKETFILTER_SELECT_OPTIONS} />
    <Field
      label="Market status"
      name="filterByStatus"
      component={RadioButtonGroup}
      options={MARKETFILTER_STATUS_OPTIONS}
      light
    />
  </form>
)

export default reduxForm({
  form: MARKETFILTER_FORM_NAME,
  destroyOnUnmount: false,
})(Form)
