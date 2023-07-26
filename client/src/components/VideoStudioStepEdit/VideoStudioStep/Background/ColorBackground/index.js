
import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

import { setBackgroundSize } from '../../../../../actions/videoStepper';
import ColorPicker from '../../../../ColorPicker';
import { sizeDimensionName, setResponsiveStyle } from '../../../../../utils/utility';

const styles = theme => {
    const mobileVideoPreviewDimension = {
        flexGrow: 1
    };
    const desktopVideoPreviewDimension = {
        flexGrow: 0
    };
    const mobileColorPicker = {
        justifyContent: 'center'
    };
    const desktopColorPicker = {
        justifyContent: 'flex-start'
    };
    const breakpoint = 'sm';
    const videoPreviewDimension = setResponsiveStyle(breakpoint, theme, mobileVideoPreviewDimension, desktopVideoPreviewDimension);
    const colorPicker = setResponsiveStyle(breakpoint, theme, mobileColorPicker, desktopColorPicker);
    return { videoPreviewDimension, colorPicker }
};

const ColorBackground = ({classes, setBackgroundSize, videoStepperBackgroundSize}) => {
    const sizeChangeHandler = (dimensionName) => event => {
        const newVal = event.target.value < 0 ? 0 : event.target.value;
        switch(dimensionName) {
            case sizeDimensionName.width:
                const updatedWidth = parseInt(newVal, 10);
                setBackgroundSize({
                    ...videoStepperBackgroundSize,
                    width: updatedWidth
                });
                break;
            case sizeDimensionName.height:
                const updatedHeight = parseInt(newVal, 10);
                setBackgroundSize({
                    ...videoStepperBackgroundSize,
                    height: updatedHeight
                });
                break;
            default:
                break;
        }
    };

    return (
        <Fragment>
            {/* TODO: block negative numbers in width and height input */}
            <Box
                display="flex">
                <Box pt={1} pr={1} className={classes.videoPreviewDimension}>
                    <TextField
                        id="width"
                        label={`${sizeDimensionName.width} (px)`}
                        value={videoStepperBackgroundSize.width}
                        onChange={sizeChangeHandler(sizeDimensionName.width)}
                        type="number"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        margin="dense"
                        variant="outlined" />
                </Box>
                <Box pt={1} pr={1} className={classes.videoPreviewDimension}>
                    <TextField
                        id="height"
                        label={`${sizeDimensionName.height} (px)`}
                        value={videoStepperBackgroundSize.height}
                        onChange={sizeChangeHandler(sizeDimensionName.height)}
                        type="number"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        margin="dense"
                        variant="outlined" />
                </Box>
            </Box>
            <Box
                display="flex"
                className={classes.colorPicker}
                p={1}>
                <ColorPicker />
            </Box>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    videoStepperBackgroundSize: state.videoStepper.backgroundSize
});
const mapActionToProps = {
    setBackgroundSize
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(ColorBackground));
