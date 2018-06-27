import { formValueSelector } from 'redux-form'
import { getFeatureConfig } from 'utils/features'

const { documents } = getFeatureConfig('legalCompliance')

const getFormValue = formValueSelector('legalCompliance')

const getLegalDocumentFields = (state) => {
  const fields = {}

  documents.forEach((doc) => {
    fields[doc.id] = !!getFormValue(state, doc.id)
  })

  return fields
}

export default state => ({
  fields: getLegalDocumentFields(state),
  documents,
})
