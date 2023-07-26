
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import VideoStudioStepEdit from '../../components/VideoStudioStepEdit';
import VideoStudioStepPreview from '../../components/VideoStudioStepPreview';
import VideoStudioStepNav from '../../components/VideoStudioStepNav';
import CustomSwitch from '../../components/CustomSwitch';
import { clearData } from '../../actions/videoStepper';
import { videoStudioSteps as steps } from '../../utils/links';
import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const stepLabelStyle = {
        padding: `0 ${spacingUnit}px`
    }

    return { stepLabelStyle };
};

class VideoStudio extends Component {
    state = {
        skipped: new Set(),
        activeStep: 0,
        // false -> edit mode, "Preview" label on the switch
        // true -> preview mode, "Edit" label on the switch
        preview: false
    };

    componentWillUnmount() {
        // clear design parameters
        const { clearData } = this.props;
        clearData();
    }

    updateActiveStep = newActiveStep => {
        if (this.state.preview) {
            this.editPreviewSwitchHandler(true);
        }
        this.setState({activeStep: newActiveStep});
    };

    isStepOptional = stepIndex => {
        return stepIndex < steps.length && steps[stepIndex].optional;
    };

    isStepSkipped = stepIndex => {
        const { skipped } = this.state;
        return skipped.has(stepIndex);
    };

    editPreviewSwitchHandler = (forceToEdit=null) => {
        if (forceToEdit === null) {
            this.setState(prevState => {
                return {preview: !prevState.preview};
            });
        } else if (this.state.preview) {
            this.setState({preview: !forceToEdit});
        }
    };

    render () {
        const { classes } = this.props;
        const { preview, activeStep } = this.state;
        return (
            <Box display="flex" flexDirection="column">
                <Box
                    pr={1}
                    pl={1}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography className={classes.stepLabelStyle} variant="h5">{steps[activeStep].label}</Typography>
                    <CustomSwitch
                        checked={preview}
                        editPreviewSwitched={this.editPreviewSwitchHandler} />
                </Box>
                { preview ? (
                    <Box p={1} flexGrow={1}>
                        <VideoStudioStepPreview />
                    </Box>
                ) : (
                    <Box p={1}>
                        <VideoStudioStepEdit
                            activeStep={activeStep}
                            isStepOptional={this.isStepOptional}
                            isStepSkipped={this.isStepSkipped}
                            editPreviewSwitched={this.editPreviewSwitchHandler} />
                    </Box>
                ) }
                <Box pl={0.5} pr={0.5}>
                    <VideoStudioStepNav
                        isPreview={preview}
                        activeStep={activeStep}
                        isStepOptional={this.isStepOptional}
                        isStepSkipped={this.isStepSkipped}
                        updateActiveStep={this.updateActiveStep}
                        editPreviewSwitched={this.editPreviewSwitchHandler} />
                </Box>
            </Box>
        );
    }
}

const mapActionToProps = {
    clearData
};
export default connect(null, mapActionToProps)(withStyles(styles)(VideoStudio));
