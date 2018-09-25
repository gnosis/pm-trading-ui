import { getCurrentAccount, hasAcceptedTermsAndConditions, isVerified } from 'integrations/store/selectors'

export default state => ({
  account: getCurrentAccount(state),
  tosAccepted: hasAcceptedTermsAndConditions(state),
  isVerified: isVerified(state),
})
