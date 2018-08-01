import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

import { marketRecordListShape } from 'utils/shapes'
import ConditionalList from './ConditionalList'

import style from './Category.scss'

const cx = classnames.bind(style)

const Category = ({
  markets, title, viewMarket, component: MarketComponent,
}) => (
  <div className={cx('marketList')}>
    <div className={cx('title')}>{title}</div>
    <ConditionalList markets={markets} component={MarketComponent} viewMarket={viewMarket} />
  </div>
)

Category.propTypes = {
  title: PropTypes.string.isRequired,
  viewMarket: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  markets: marketRecordListShape,
}

Category.defaultProps = {
  markets: undefined,
}

export default Category
