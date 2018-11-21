import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { withNamespaces } from 'react-i18next'

import { getFeatureConfig } from 'utils/features'

import DocumentExplanation from './DocumentExplanation'
import DocumentField from './DocumentField'

import style from './Form.scss'

const legalComplianceEnabled = getFeatureConfig('legalCompliance')

const cx = classnames.bind(style)

const LegalCompliance = ({
  documents,
  fields,
  showHeading,
  showExplanation,
  applicationName,
  submitButtonClassName,
  submitButtonDisabledClassName,
  submitButtonLabel,
  submitButtonComponent: ButtonComponent,
  submitButtonOpts,
  disabled,
  onSubmitAcceptedDocs,
  t,
}) => {
  if (!legalComplianceEnabled) {
    return (
      <ButtonComponent
        className={cx(submitButtonClassName)}
        onClick={() => onSubmitAcceptedDocs()}
        {...submitButtonOpts}
      >
        {submitButtonLabel}
      </ButtonComponent>
    )
  }

  const documentList = []
  documents.forEach((doc, index) => {
    documentList.push(<DocumentExplanation t={t} key={doc.id} {...doc} />)
    if (index === documents.length - 2) {
      documentList.push(<span key={`${doc.id}-separator`}> {t('and')} </span>)
      return
    }

    if (index !== documents.length - 1) {
      documentList.push(<span key={`${doc.id}-separator`}>, </span>)
    }
  })

  const documentIds = documents.map(doc => doc.id)
  const hasAcceptedAll = documentIds.every(docId => !!fields[docId])
  const canSubmit = !disabled && hasAcceptedAll

  return (
    <div>
      {showHeading && <h4 className={cx('heading')}>{t('legal.heading')}</h4>}
      {showExplanation && (
        <p className={cx('explanation')}>
          {t('legal.to_use_app', { appName: applicationName || t('application') })}&nbsp;
          <>{documentList}</>.
        </p>
      )}
      <div className={cx('checks')}>
        {documents.map(doc => (
          <DocumentField t={t} key={doc.id} {...doc} className={cx('checkBox')} />
        ))}
      </div>
      <ButtonComponent
        className={cx(submitButtonClassName, { [submitButtonDisabledClassName]: !canSubmit })}
        disabled={!canSubmit}
        onClick={() => onSubmitAcceptedDocs(documentIds)}
        {...submitButtonOpts}
      >
        {submitButtonLabel}
      </ButtonComponent>
    </div>
  )
}

LegalCompliance.propTypes = {
  className: PropTypes.string,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.id,
      title: PropTypes.string,
    }),
  ).isRequired,
  fields: PropTypes.objectOf(PropTypes.bool).isRequired,
  showHeading: PropTypes.bool,
  showExplanation: PropTypes.bool,
  applicationName: PropTypes.string,
  submitButtonLabel: PropTypes.node,
  submitButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  submitButtonClassName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  submitButtonDisabledClassName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  submitButtonOpts: PropTypes.shape({}),
  disabled: PropTypes.bool,
  onSubmitAcceptedDocs: PropTypes.func,
  t: PropTypes.func.isRequired,
}

LegalCompliance.defaultProps = {
  className: '',
  showHeading: false,
  showExplanation: false,
  applicationName: undefined,
  submitButtonLabel: 'LOGIN',
  submitButtonComponent: 'button',
  submitButtonClassName: '',
  submitButtonOpts: {},
  submitButtonDisabledClassName: 'disabled',
  disabled: false,
  onSubmitAcceptedDocs: () => {},
}

export default withNamespaces()(LegalCompliance)
