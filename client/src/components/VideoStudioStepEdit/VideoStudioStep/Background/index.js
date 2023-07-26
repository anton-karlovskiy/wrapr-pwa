
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { setBackgroundColor, setBackgroundImage } from '../../../../actions/videoStepper';
import RadioButtonsGroup from './RadioButtonsGroup';
import ImageBackground from './ImageBackground';
import ColorBackground from './ColorBackground';
import { flexDirection } from '../../../../utils/utility';
import { initialBackgroundColor } from '../../../../utils/links';

const optionList = [
    {
        value: 'image',
        label: 'Image Background'
    },
    {
        value: 'color',
        label: 'Color Background'
    },
];

class Background extends Component {
    state = {
        optionValue: optionList[0].value
    };

    componentDidMount() {
        // when click on previous from video step
        const { videoStepperBackgroundColor } = this.props;
        if (videoStepperBackgroundColor) {
            this.setState({ optionValue:  optionList[1].value});
        }
    }

    componentDidUpdate() {
        const { setBackgroundColor, videoStepperBackgroundColor, setBackgroundImage } = this.props;
        if (this.state.optionValue === optionList[0].value) {
            setBackgroundColor(null);
        } else if (this.state.optionValue === optionList[1].value && !videoStepperBackgroundColor) {
            setBackgroundImage(null);
            setBackgroundColor(initialBackgroundColor);
        }
    }
    
    radioChangeHandler = event => {
        this.setState({ optionValue: event.target.value });
    };

    render() {
        const { editPreviewSwitched } = this.props;
        return (
            <Fragment>
                <RadioButtonsGroup
                    direction={flexDirection.horizontal}
                    radioChanged={this.radioChangeHandler}
                    checked={this.state.optionValue}
                    radioButtons={optionList} />
                { this.state.optionValue === optionList[0].value && (
                    <ImageBackground editPreviewSwitched={editPreviewSwitched} />
                ) }
                { this.state.optionValue === optionList[1].value && (
                    <ColorBackground />
                ) }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    videoStepperBackgroundColor: state.videoStepper.backgroundColor
});
const mapActionToProps = {
    setBackgroundColor,
    setBackgroundImage
};

// TODO: optimize redux state by passing down as props to child components
export default connect(mapStateToProps, mapActionToProps)(Background);
