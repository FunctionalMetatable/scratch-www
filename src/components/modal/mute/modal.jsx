const bindAll = require('lodash.bindall');
const PropTypes = require('prop-types');
const React = require('react');
const FormattedMessage = require('react-intl').FormattedMessage;
const injectIntl = require('react-intl').injectIntl;
const intlShape = require('react-intl').intlShape;
const Modal = require('../base/modal.jsx');
const ModalInnerContent = require('../base/modal-inner-content.jsx');
const Button = require('../../forms/button.jsx');
const Progression = require('../../progression/progression.jsx');
const FlexRow = require('../../flex-row/flex-row.jsx');
const MuteStep = require('./mute-step.jsx');
const Formsy = require('formsy-react').default;
const InplaceInput = require('../../../components/forms/inplace-input.jsx');
const classNames = require('classnames');
require('./modal.scss');

const steps = {
    COMMENT_ISSUE: 0,
    MUTE_INFO: 1,
    BAN_WARNING: 2,
    USER_FEEDBACK: 3,
    FEEDBACK_SENT: 4
};

const onUpdate = update => update;

class MuteModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleNext',
            'handlePrevious',
            'handleGoToFeedback',
            'handleFeedbackInput',
            'handleFeedbackSubmit'
        ]);
        this.numSteps = 2;
        if (this.props.showWarning) {
            this.numSteps++;
        }
        this.state = {
            step: 0,
            feedback: ''
        };
    }
    handleNext () {
        this.setState({
            step: this.state.step + 1
        });
    }
    handlePrevious () {
        // This shouldn't get called when we're on the first step, but
        // the Math.max is here as a safeguard so state doesn't go negative.
        this.setState({
            step: Math.max(0, this.state.step - 1)
        });
    }
    handleGoToFeedback () {
        this.setState({
            step: steps.USER_FEEDBACK
        });
    }

    handleFeedbackSubmit () {
        console.log(this.state.feedback);
        this.setState({
            step: steps.FEEDBACK_SENT
        });
    }

    handleFeedbackInput (event) {
        this.setState({
            feedback: event.target.value,
        });
    }

    render () {
        const finalStep = this.showWarning ? steps.BAN_WARNING : steps.MUTE_INFO;

        return (
            <Modal
                isOpen
                useStandardSizes
                className="modal-mute"
                showCloseButton={false}
                onRequestClose={this.props.onRequestClose}
            >
                <div className="mute-modal-header modal-header" />
                <ModalInnerContent className="mute-inner-content">
                    <Progression step={this.state.step}>
                        <MuteStep
                            bottomImg="/svgs/commenting/comment_feedback.svg"
                            bottomImgClass="bottom-img"
                            header={this.props.intl.formatMessage({id: this.props.muteModalMessages.muteStepHeader})}
                        >
                            {this.props.muteModalMessages.muteStepContent.map(message => (
                                <p key={message}>
                                    <FormattedMessage id={message} />
                                </p>
                            ))}

                        </MuteStep>
                        <MuteStep
                            header={this.props.intl.formatMessage(
                                {id: 'comments.muted.duration'},
                                {inDuration: this.props.timeMuted}
                            )}
                            sideImg="/svgs/commenting/mute_time.svg"
                            sideImgClass="side-img"
                        >
                            <p>
                                <FormattedMessage id="comments.muted.commentingPaused" />
                            </p>
                            <p>
                                <FormattedMessage
                                    id="comments.muted.moreInfoGuidelines"
                                    values={{CommunityGuidelinesLink: (
                                        <a href="/community_guidelines">
                                            <FormattedMessage id="report.CommunityGuidelinesLinkText" />
                                        </a>
                                    )}}
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    id="comments.muted.mistake"
                                    values={{feedbackLink: (
                                        <a onClick={this.handleGoToFeedback}>
                                            <FormattedMessage id="comments.muted.feedbackLinkText" />
                                        </a>
                                    )}}
                                />
                            </p>
                        </MuteStep>
                        <MuteStep
                            bottomImg="/svgs/commenting/warning.svg"
                            bottomImgClass="bottom-img"
                            header={this.props.intl.formatMessage({id: 'comments.muted.warningBlocked'})}
                        >
                            <p>
                                <FormattedMessage
                                    id="comments.muted.warningCareful"
                                    values={{CommunityGuidelinesLink: (
                                        <a href="/community_guidelines">
                                            <FormattedMessage id="report.CommunityGuidelinesLinkText" />
                                        </a>
                                    )}}
                                />
                            </p>
                        </MuteStep>
                        <MuteStep
                            header={this.props.intl.formatMessage({id: 'comments.muted.mistakeHeader'})}
                        >
                            <p className="feedback-text">
                                <FormattedMessage id="comments.muted.mistakeInstructions" />
                            </p>
                            <Formsy className="full-width-form">
                                <InplaceInput
                                    className={classNames('compose-feedback',
                                        this.state.feedback.length > 0 ?
                                            'compose-valid' : 'compose-invalid')}
                                    handleUpdate={onUpdate}
                                    name="compose-feedback"
                                    rows="5"
                                    type="textarea"
                                    value={this.state.feedback}
                                    onInput={this.handleFeedbackInput}
                                />
                            </Formsy>
                            <div className="character-limit">
                                <FormattedMessage id="comments.muted.characterLimit" />
                            </div>
                        </MuteStep>
                        <MuteStep
                            header={this.props.intl.formatMessage({id: 'comments.muted.thanksFeedback'})}
                            sideImg="/svgs/commenting/thank_you_envelope.svg"
                            sideImgClass="side-img"
                        >
                            <p>
                                <FormattedMessage id="comments.muted.thanksInfo" />
                            </p>
                        </MuteStep>
                    </Progression>
                    <FlexRow className={classNames('nav-divider')} />
                    <FlexRow
                        className={classNames(
                            this.state.step === steps.USER_FEEDBACK ? 'feedback-nav' : 'mute-nav'
                        )}
                    >
                        {this.state.step >= finalStep ? (
                            <Button
                                className={classNames('close-button')}
                                onClick={this.props.onRequestClose}
                            >
                                <div className="action-button-text">
                                    {this.state.step === steps.USER_FEEDBACK ? (
                                        <FormattedMessage id="general.cancel" />
                                    ) : (
                                        <FormattedMessage id="general.close" />
                                    )}
                                </div>
                            </Button>
                        ) : (
                            <Button
                                className={classNames('next-button')}
                                onClick={this.handleNext}
                            >
                                <div className="action-button-text">
                                    <FormattedMessage id="general.next" />
                                </div>
                            </Button>
                        )}
                        {this.state.step > 0 && this.state.step < steps.USER_FEEDBACK ? (
                            <Button
                                className={classNames(
                                    'back-button',
                                )}
                                onClick={this.handlePrevious}
                            >
                                <div className="action-button-text">
                                    <FormattedMessage id="general.back" />
                                </div>
                            </Button>
                        ) : this.state.step === steps.USER_FEEDBACK ? (
                            <Button
                                className={classNames(
                                    'send-button',
                                )}
                                onClick={this.handleFeedbackSubmit}
                            >
                                <div className="action-button-text">
                                    <FormattedMessage id="general.send" />
                                </div>
                            </Button>
                        ) : null}
                        
                    </FlexRow>
                </ModalInnerContent>
            </Modal>
        );
    }
}

MuteModal.propTypes = {
    intl: intlShape,
    muteModalMessages: PropTypes.shape({
        commentType: PropTypes.string,
        muteStepHeader: PropTypes.string,
        muteStepContent: PropTypes.array
    }),
    onRequestClose: PropTypes.func,
    showWarning: PropTypes.bool,
    timeMuted: PropTypes.string
};

module.exports = injectIntl(MuteModal);
