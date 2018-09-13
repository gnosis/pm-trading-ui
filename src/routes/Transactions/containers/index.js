import Loadable from 'react-loadable'

const LoadableTransactions = Loadable({
  loader: () => import('./TransactionsPage'),
  loading: () => null,
})

export default LoadableTransactions
