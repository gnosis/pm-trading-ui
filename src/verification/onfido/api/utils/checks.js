export const handleResponse = async (response) => {
  if (response.ok) {
    return response.json()
  }

  let responseBody
  try {
    responseBody = await response.json()
  } catch (err) {
    // json parse error, probably not JSON content returned
  }

  if (responseBody && responseBody.Message) {
    throw new Error(responseBody.Message)
  }

  throw new Error(response.statusText)
}
