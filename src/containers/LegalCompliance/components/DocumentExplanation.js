import React from 'react'
import PropTypes from 'prop-types'

const TOS_DOCUMENT = 'TOS_DOCUMENT'
const TOS_TEXT = 'TOS_TEXT'

const DOCUMENT_TYPES = {
  FILE: TOS_DOCUMENT,
  TEXT: TOS_TEXT,
}

const LegalDocumentTitle = ({
  type, file, id, t,
}) => {
  if (type === DOCUMENT_TYPES.FILE) {
    return (
      <span>
        <a href={`${file}`} target="_blank" rel="noopener noreferrer">
          {t(`legal.documents.${id}`)}
        </a>
      </span>
    )
  }
  if (type === DOCUMENT_TYPES.TEXT) {
    return <span>{t(`legal.documents.${id}_short`)}</span>
  }

  return null
}

LegalDocumentTitle.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  file: PropTypes.string,
}

LegalDocumentTitle.defaultProps = {
  file: '',
}

export default LegalDocumentTitle
