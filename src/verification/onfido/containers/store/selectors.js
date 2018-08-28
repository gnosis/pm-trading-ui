import { getCurrentAccount } from 'integrations/store/selectors'

export default state => ({
  account: getCurrentAccount(state),
})
