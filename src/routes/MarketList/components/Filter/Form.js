import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { compose } from 'recompose'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import {
  TextInput, Select, RadioButtonGroup,
} from 'components/Form'
import style from './Filter.scss'

const cx = cn.bind(style)

export const MARKETFILTER_FORM_NAME = 'MARKETLIST_FORM'

const Form = ({ t }) => {
  const MARKETFILTER_SELECT_OPTIONS = [
    {
      label: t('markets.filter_resolution_date_asc'),
      value: { key: 'resolution', dir: 'asc' },
    },
    {
      label: t('markets.filter_resolution_date_desc'),
      value: { key: 'resolution', dir: 'desc' },
    },
    {
      label: t('markets.filter_trading_volume_asc'),
      value: { key: 'volume', dir: 'asc' },
    },
    {
      label: t('markets.filter_trading_volume_desc'),
      value: { key: 'volume', dir: 'desc' },
    },
  ]

  const MARKETFILTER_STATUS_OPTIONS = [
    {
      label: t('markets.filter_status_all'),
      value: '',
    },
    {
      label: t('markets.filter_status_open'),
      value: 'isOpen',
    },
    {
      label: t('markets.filter_status_closed'),
      value: 'isClosed',
    },
  ]

  return ((
    <form>
      <Field
        label={t('markets.filter_search')}
        name="filterQuery"
        component={TextInput}
        placeholder={t('markets.filter_search_hint')}
        decoration="underlined"
        className={cx('filterInput')}
      />
      <Field label={t('markets.filter_sortby')} name="sortBy" component={Select} options={MARKETFILTER_SELECT_OPTIONS} />
      <Field
        label={t('markets.filter_status')}
        name="filterByStatus"
        component={RadioButtonGroup}
        options={MARKETFILTER_STATUS_OPTIONS}
        light
      />
    </form>
  ))
}

Form.propTypes = {
  t: PropTypes.func.isRequired,
}

const enhancer = compose(
  reduxForm({
    form: MARKETFILTER_FORM_NAME,
    destroyOnUnmount: false,
  }),
  withNamespaces(),
)

export default enhancer(Form)
