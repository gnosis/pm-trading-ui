export default () => {
  const APP_ID = 'km54f6ih'
  const d = document

  const s = d.createElement('script')
  s.type = 'text/javascript'
  s.async = true
  s.src = `https://widget.intercom.io/widget/${APP_ID}`
  const x = d.getElementsByTagName('script')[0]
  x.parentNode.insertBefore(s, x)

  s.onload = (_) => {
    window.Intercom('boot', {
      app_id: 'km54f6ih',
      consent: true,
    })
  }
}
