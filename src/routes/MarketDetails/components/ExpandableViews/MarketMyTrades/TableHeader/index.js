import React from 'react'

const TableHeader = () => (
  <thead>
    <tr>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--index" />
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Order Type</th>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Outcome</th>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Outcome token count</th>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Avg. Price</th>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Date</th>
      <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Cost</th>
    </tr>
  </thead>
)

export default TableHeader
