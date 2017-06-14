import { schema } from 'normalizr'

export const MarketSchema = new schema.Entity('market')
export const CategoricalEventSchema = new schema.Entity('categoricalEvent')
export const ScalarEventSchema = new schema.Entity('scalarEvent')
export const CategoricalEventDescriptionSchema = new schema.Entity('categoricalEventDescription')
export const ScalarEventDescriptionSchema = new schema.Entity('scalarEventDescription')
export const CentralizedOracleSchema = new schema.Entity('centralizedOracle')
