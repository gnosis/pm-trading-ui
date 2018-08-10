const setCookie = (key, value, days) => {
  const date = new Date()

  let expirationDate
  if (days) {
    // Get unix milliseconds at current time plus number of days
    expirationDate = new Date(date.setTime(+date + days * 86400000)) // 24 * 60 * 60 * 1000
  }

  document.cookie = `${key}=${value};expires=${expirationDate ? expirationDate.toUTCString() : ''}; path=/`
}

export { setCookie }
