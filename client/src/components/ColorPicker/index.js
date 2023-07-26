
import React from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';

import { setBackgroundColor } from '../../actions/videoStepper';

const ColorPicker = ({videoStepperBackgroundColor, setBackgroundColor}) => {
    const changeColorhanlder = (color, event) => {
        setBackgroundColor(color.hex);
    };

    return (
        videoStepperBackgroundColor && <CompactPicker
            color={videoStepperBackgroundColor}
            onChangeComplete={changeColorhanlder} />
    );
};

const mapStateToProps = state => ({
    videoStepperBackgroundColor: state.videoStepper.backgroundColor
});
const mapActionToProps = {
    setBackgroundColor
};

export default connect(mapStateToProps, mapActionToProps)(ColorPicker);
