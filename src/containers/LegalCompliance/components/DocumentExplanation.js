import React from 'react'

const TOS_DOCUMENT = 'TOS_DOCUMENT'
const TOS_TEXT = 'TOS_TEXT'

const DOCUMENT_TYPES = {
  FILE: TOS_DOCUMENT,
  TEXT: TOS_TEXT,
}

const LegalDocumentTitle = ({
  type, title, file, short,
}) => {
  if (type === DOCUMENT_TYPES.FILE) {
    return (
      <span>
        <a href={`${file}`} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </span>
    )
  }
  if (type === DOCUMENT_TYPES.TEXT) {
    return (
      <span>
        {short}
      </span>
    )
  }
}

export default LegalDocumentTitle
