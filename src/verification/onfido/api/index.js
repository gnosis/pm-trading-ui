/* globals fetch */
import { getFeatureConfig } from 'utils/features'

const verificationConfig = getFeatureConfig('verification') || {}

const API_URL = verificationConfig?.options?.url

export const createUserVerification = async (firstName, lastName, email, signature, account) => {
  const response = await fetch(`${API_URL}/users/${account}`, {
    method: 'POST',
    body: JSON.stringify({
      name: firstName,
      lastName,
      email,
      signature,
    }),
  })

  const body = await response.json()

  return body
}

export const requestUserVerification = async (account) => {
  try {
    const response = await fetch(`${API_URL}/users/${account}`)
    const body = await response.json()

    return body
  } catch (err) {
    return undefined
  }
}

export const startUserReport = async (account) => {
  try {
    const { status } = await fetch(`${API_URL}/users/${account}`, {
      method: 'PUT',
    })

    return status === 201 || status === 204
  } catch (err) {}

  return false
}
