const getCookie = (cname) => {
  const match = document.cookie.match(`(^|;) ?${cname}=([^;]*)(;|$)`)
  return match ? match[2] : ''
}

export { getCookie }
