
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import PaperLayer from '../../hoc/PaperLayer';
import VideoStudioStep from './VideoStudioStep';
import { setLoadingStatus } from '../../actions/loadingStatus';
import { screenSize, measureScreenSize, getSpacingUnit } from '../../utils/utility';
import { videoStudioSteps as steps } from '../../utils/links';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const stepperStyle = {
        padding: spacingUnit / 2
    };
    const stepLabelStyle = {
        marginTop: '0 !important',
        fontSize: '0.75rem'
    };

    return { stepperStyle, stepLabelStyle };
};

const getStepContent = step => {
    return steps[step].content;
};

class VideoStudioStepEdit extends Component {
    render() {
        const { classes, width, activeStep, editPreviewSwitched, isStepOptional, isStepSkipped } = this.props;
        const onDesktop = screenSize.desktop === measureScreenSize('sm', isWidthUp, width);

        return (
            <PaperLayer>
                <Fragment>
                    <Stepper alternativeLabel={!onDesktop} className={classes.stepperStyle} activeStep={activeStep} orientation={'horizontal'}>
                        { steps.map((step, index) => {
                            const props = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = <Typography variant="caption">Optional</Typography>;
                            }
                            if (isStepSkipped(index)) {
                                props.completed = false;
                            }
                            return (
                                <Step key={step.label} {...props}>
                                    <StepLabel
                                        classes={{alternativeLabel: classes.stepLabelStyle}}
                                        {...labelProps}>{onDesktop && step.label}</StepLabel>
                                </Step>
                            );
                        }) }
                    </Stepper>
                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                </Fragment>
                {activeStep < steps.length && <VideoStudioStep editPreviewSwitched={editPreviewSwitched} stepIndex={activeStep} />}
            </PaperLayer>
        );
    }
}

VideoStudioStepEdit.propTypes = {
    classes: PropTypes.object
};

const mapStateToProps = state => ({
    videoStepperState: state.videoStepper
});
const mapActionToProps = {
    setLoadingStatus
};

export default connect(mapStateToProps, mapActionToProps)(withWidth()(withStyles(styles)(withRouter(VideoStudioStepEdit))));
