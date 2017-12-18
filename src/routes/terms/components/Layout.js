import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import Subtitle from 'components/layout/Subtitle'
import Title from 'components/layout/Title'
import * as React from 'react'
import ScopeOfTerms from './ScopeOfTerms'
import Gnosis from './Gnosis'
import Olympia from './Olympia'
import HowTo from './HowTo'
import Eligibility from './Eligibility'
import OlympiaTokens from './OlympiaTokens'
import LicencesAccess from './LicencesAccess/'
import Disclaimers from './Disclaimers'
import RegulatoryRisks from './RegulatoryRisks'
import Warranties from './Warranties'
import Indemnity from './Indemnity'

const TermsOfUse = () => (
  <PageFrame width="750px">
    <Block margin="md">
      <Title>TERMS OF USE</Title>
      <Paragraph>Last Updated: 18th December 2017</Paragraph>
    </Block>
    <ScopeOfTerms />
    <Gnosis />
    <Olympia />
    <HowTo />
    <Eligibility />
    <OlympiaTokens />
    <LicencesAccess />
    <Disclaimers />
    <RegulatoryRisks />
    <Warranties />
    <Indemnity />
  </PageFrame>
)

export default TermsOfUse
