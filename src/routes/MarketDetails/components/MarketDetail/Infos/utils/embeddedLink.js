export default (marketAddress) => {
  const path = `${window.location.origin}/embedded/${marketAddress}`

  return `
    <div class="gnosis-market-wrapper">
      <iframe class="gnosis-market" src="${path}"height="280"></iframe>
    </div>
    <style>
      .gnosis-market-wrapper {
        width: 100%;
        position: relative;
        border: none;
        background: none;
      }

      .gnosis-market {
        width: 100%;
        border: none;
      }
    </style>
  `
}
