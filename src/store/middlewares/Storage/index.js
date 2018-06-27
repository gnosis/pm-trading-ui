import StorageLoader from './Load'
import StorageDumper from './Dump'

export * from './actions'

const localstorageOptions = {
  whitelist: ['transactions.log', 'integrations.accountSettings'],
}
export const LocalStorageDump = StorageDumper(window.localStorage, localstorageOptions)
export const LocalStorageLoad = StorageLoader(window.localStorage, localstorageOptions)

const sessionstorageOptions = {
  whitelist: ['modal'],
}
export const SessionStorageDump = StorageDumper(window.sessionStorage, sessionstorageOptions)
export const SessionStorageLoad = StorageLoader(window.sessionStorage, sessionstorageOptions)
