
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ContainedButton from '../ContainedButton';
import DefaultButton from '../DefaultButton';
import AlertDialog from '../AlertDialog';
import { setLoadingStatus } from '../../actions/loadingStatus';
import { videoStudioSteps as steps, pageLinks } from '../../utils/links';
import { videoStepperValidate } from '../../utils/validation';
import { screenSize, measureScreenSize, getSpacingUnit, elementSizePosSet } from '../../utils/utility';
import { render1, render2, render3 } from '../../utils/api';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const instructions = {
        padding: spacingUnit / 2
    };
  
    return { instructions };
};

class VideoStudioStepNav extends Component {
    state = {
        alertOpen: false,
        alertStrings: []
    };

    nextHandler = () => {
        const { videoStepperState, activeStep, isStepSkipped } = this.props;
        let { skipped } = this.state;
        if (isStepSkipped(activeStep)) {
            skipped = new Set(skipped.values());
            skipped.delete(activeStep);
        }

        this.checkRendering(activeStep, videoStepperState);
    };

    prevHandler = () => {
        const { activeStep, updateActiveStep } = this.props;
        updateActiveStep(activeStep - 1);
    };

    skipHandler = () => {
        const { activeStep, updateActiveStep, isStepOptional } = this.props;
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        this.setState(prevState => {
            const skipped = new Set(prevState.skipped.values());
            skipped.add(activeStep);
            updateActiveStep(activeStep + 1);
            return {
                skipped
            };
        });
    };

    resetHandler = () => {
        const { updateActiveStep } = this.props;
        updateActiveStep(0);
    };

    moveToNextStep = () => {
        const { activeStep, updateActiveStep, isPreview, editPreviewSwitched, isStepOptional } = this.props;

        // next if available or direct to my videos
        if (activeStep === steps.length - 1) {
            const endingMessages = [
                'We will email you the link once it\'s rendered.',
                'You can visit My Videos to enjoy it then.',
                'For now please render one by one video, concurrently rendering is not much supported.'
            ];
            this.alertOpenHandler(endingMessages);
        } else {
            if (isPreview || isStepOptional(activeStep)) {
                updateActiveStep(activeStep + 1);
            } else {
                editPreviewSwitched();
            }
        }
    };

    checkRendering = (step, videoStepperState) => {
        const { setLoadingStatus, editPreviewSwitched } = this.props;

        if (step === steps[2].index) {
            const { headerFooters } = videoStepperState;
            if (!this.elementsSizePosSet(headerFooters)) {
                editPreviewSwitched();
                return;
            }

            setLoadingStatus({ 
                loading: true,
                text: "Creating background image..."
            });
            render1(videoStepperState, this.renderSuccessCallback, this.renderErrorCallback);
        } else if (step === steps[4].index) {
            const { texts, gifImages } = videoStepperState;
            if (!this.elementsSizePosSet(texts)) {
                editPreviewSwitched();
                return;
            }
            if (!this.elementsSizePosSet(gifImages)) {
                editPreviewSwitched();
                return;
            }

            setLoadingStatus({
                loading: true,
                text: "Rendering video with texts and images..."
            });

            render2(videoStepperState, this.renderSuccessCallback, this.renderErrorCallback);
        } else if (step === steps[5].index) {
            setLoadingStatus({ 
                loading: true,
                text: "Final Rendering with subtitles..."
            });

            render3(videoStepperState, this.renderSuccessCallback, this.renderErrorCallback);
        } else {
            this.moveToNextStep();
        }
    };

    renderSuccessCallback = response => {
        const { setLoadingStatus } = this.props;
        setLoadingStatus({loading: false});
        this.moveToNextStep();
    };

    renderErrorCallback = error => {
        console.log('mars: render failure error=', error);
        const { setLoadingStatus } = this.props;
        toast.error('Rendering Failed!', {
            position: toast.POSITION.BOTTOM_RIGHT
        });

        setLoadingStatus({loading: false});
    };

    elementsSizePosSet = elements => {
        try {
            elements.forEach(element => {
                if (!elementSizePosSet(element)) {
                    throw 'BreakException';
                }
            });
        } catch (error) {
            if (error === 'BreakException') {
                return false;
            }
        }
        return true;
    };

    validationHandler = () => {
        const { videoStepperState, activeStep, isStepOptional } = this.props;
        const stepOptional = isStepOptional(activeStep);
        if (stepOptional) {
            this.nextHandler();
        } else {
            const { valid, alertStrings } = videoStepperValidate(activeStep, videoStepperState);
            valid ? this.nextHandler() : this.alertOpenHandler(alertStrings);
        }
    };

    alertOpenHandler = (alertStrings) => {
        this.setState({alertOpen: true, alertStrings});
    };

    alertClosehandler = () => {
        this.setState({alertOpen: false});
        const { history, activeStep, editPreviewSwitched } = this.props;
        if (activeStep === steps.length - 1) {
            history.push(pageLinks.WrapperList.url);
        } else {
            editPreviewSwitched(true);
        }
    };

    render () {
        // ray test touch <
        const { classes, activeStep, width, /*isStepOptional*/ } = this.props;
        // ray test touch >
        const { alertOpen, alertStrings } = this.state;

        const onDesktop = screenSize.desktop === measureScreenSize('sm', isWidthUp, width);

        const stepsCompleteBlock = (
            <Fragment>
                <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                </Typography>
                <DefaultButton
                    clicked={this.resetHandler}>
                    Reset
                </DefaultButton>
            </Fragment>
        );
        
        const stepsActionsBlock = (
            <Box display="flex">
                <Box flexGrow={onDesktop ? 0 : 1}>
                    <ContainedButton
                        primary
                        disabled={activeStep === 0}
                        clicked={this.prevHandler}>
                        Prev
                    </ContainedButton>
                </Box>
                {/* ray test touch < */}
                {/* { isStepOptional(activeStep) && (
                    <Box flexGrow={onDesktop ? 0 : 1}>
                        <ContainedButton
                            primary
                            clicked={this.skipHandler}>
                            Skip
                        </ContainedButton>
                    </Box>
                ) } */}
                {/* ray test touch > */}
                <Box flexGrow={ onDesktop ? 0 : 1 }>
                    <ContainedButton
                        primary
                        clicked={this.validationHandler}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </ContainedButton>
                </Box>
            </Box>
        );
    
        return (
            <Fragment>
                <ToastContainer />
                <AlertDialog
                    opened={alertOpen}
                    closed={this.alertClosehandler}
                    content={alertStrings} />
                { activeStep === steps.length ? (
                    <div>
                        {stepsCompleteBlock}
                    </div>
                ) : (
                    <div>
                        {stepsActionsBlock}
                    </div>
                ) }
            </Fragment>
        );
    }
};

const mapStateToProps = state => ({
    videoStepperState: state.videoStepper
});
const mapActionToProps = {
    setLoadingStatus
};

export default connect(mapStateToProps, mapActionToProps)(withWidth()(withStyles(styles)(withRouter(VideoStudioStepNav))));
