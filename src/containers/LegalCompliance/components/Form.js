import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

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
}) => {
  if (!legalComplianceEnabled) {
    return (
      <ButtonComponent className={cx(submitButtonClassName)} onClick={() => onSubmitAcceptedDocs()} {...submitButtonOpts}>
        {submitButtonLabel}
      </ButtonComponent>
    )
  }

  const documentIds = documents.map(doc => doc.id)
  const hasAcceptedAll = documentIds.every(docId => !!fields[docId])
  const canSubmit = !disabled && hasAcceptedAll

  return (
    <div>
      {showHeading && (
        <h4 className={cx('heading')}>
Terms of service and privacy policy
        </h4>
      )}
      {showExplanation && (
        <p className={cx('explanation')}>
          For using {applicationName}, you have to agree with our&nbsp;
          <React.Fragment>
            {documents
              .map(doc => <DocumentExplanation key={doc.id} {...doc} />)
              .reduce((acc, elem) => [...acc, <span>
                {' '}
                  and
                {' '}
              </span>, elem], [])}
          </React.Fragment>
          .
        </p>
      )}
      <div className={cx('checks')}>{documents.map(doc => <DocumentField {...doc} className={cx('checkBox')} />)}</div>
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
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
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
  submitButtonOpts: PropTypes.object,
  disabled: PropTypes.bool,
  onSubmitAcceptedDocs: PropTypes.func,
}

LegalCompliance.defaultProps = {
  showHeading: false,
  showExplanation: false,
  applicationName: 'the application',
  submitButtonLabel: 'LOGIN',
  submitButtonComponent: 'button',
  submitButtonClassName: '',
  submitButtonOpts: {},
  submitButtonDisabledClassName: 'disabled',
  disabled: false,
  onSubmitAcceptedDocs: () => {},
}

export default LegalCompliance
