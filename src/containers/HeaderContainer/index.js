import { connect } from 'react-redux'

import Header from 'components/Header'

import { getDefaultAccount } from 'selectors/blockchain'

const mapStateToProps = state => ({
  defaultAccount: getDefaultAccount(state),
})

export default connect(mapStateToProps)(Header)
