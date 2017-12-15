import React from 'react'
import PropTypes from 'prop-types'
import createIcon from 'blockies'
import Tooltip from 'rc-tooltip'
import Img from 'components/layout/Img'

import { generateWalletName, hexWithoutPrefix } from 'utils/helpers'

const Identicon = ({ account }) => {
  const canvas = createIcon({
    // All options are optional
    seed: hexWithoutPrefix(account).toLowerCase(), // seed used to generate icon data, default: random
    color: '#00a6c4', // to manually specify the icon color, default: random
    bgcolor: '#60c7da', // choose a different background color, default: random
    size: 10, // width/height of the icon in blocks, default: 8
    scale: 3, // width/height of each block in pixels, default: 4
    spotcolor: '#c0e9f1', // each pixel has a 13% chance of being of a third color,
    // default: random. Set to -1 to disable it. These "spots" create structures
    // that look like eyes, mouths and noses.
  })

  return (
    <Tooltip placement="left" overlay={`"${generateWalletName(account)}" (${hexWithoutPrefix(account)})`}>
      <Img src={canvas.toDataURL()} alt={account} />
    </Tooltip>
  )
}

Identicon.propTypes = {
  account: PropTypes.string,
}

export default Identicon
