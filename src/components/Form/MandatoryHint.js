import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classnames from 'classnames/bind'
import Tooltip from 'rc-tooltip'

import styles from './MandatoryHint.scss'

const cx = classnames.bind(styles)

const MandatoryHint = ({ t }) => (
  <Tooltip overlay={(
    <span>
      {t('form.field_required')};
    </span>
  )}
  >
    <span className={cx('mandatoryHint')}>
*
    </span>
  </Tooltip>
)

MandatoryHint.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(MandatoryHint)
