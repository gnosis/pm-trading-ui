import React from 'react'
import PageFrame from 'components/layout/PageFrame'
import Title from 'components/layout/Title'
import SignUp from './metamaskComponents/SignUp'
import MarketOverview from './metamaskComponents/MarketOverview'
import DashboardOverview from './metamaskComponents/DashboardOverview'
import MakePrediction from './metamaskComponents/MakePrediction'
import Profits from './metamaskComponents/ProfitsAndScoreboard'
import ClaimRewards from './metamaskComponents/ClaimRewards'

const GameGuide = () => (
  <PageFrame width="750px">
    <Title>GAME GUIDE</Title>
    <SignUp />
    <MarketOverview />
    <DashboardOverview />
    <MakePrediction />
    <Profits />
    <ClaimRewards />
  </PageFrame>
)

export default GameGuide
