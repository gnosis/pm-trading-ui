import { API_URL } from 'api/rest'
import { normalize } from 'normalizr'
import { restFetch, hexWithoutPrefix } from 'utils/helpers'
import { marketSchema } from 'api/schema'

const requestMarket = async marketAddress =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/`).then(response =>
    normalize({ ...response, local: false }, marketSchema))

export default requestMarket
