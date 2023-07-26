
import React, { Fragment } from 'react';

import Background from './Background';
import Video from './Video';
import HeaderFooters from './HeaderFooters';
import Text from './Text';
import GifImages from './GifImages';
import Subtitles from './Subtitles';
import { videoStudioSteps } from '../../../utils/links';

const getCurrentStep = (editPreviewSwitched, stepIndex) => {
    let currentStepComponent;
    switch(stepIndex) {
        case videoStudioSteps[0].index:
            currentStepComponent = <Background editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[1].index:
            currentStepComponent = <Video editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[2].index:
            currentStepComponent = <HeaderFooters editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[3].index:
            currentStepComponent = <Text editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[4].index:
            currentStepComponent = <GifImages editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[5].index:
            currentStepComponent = <Subtitles />;
            break;
        default:
            break;
    }
    return currentStepComponent;
}

const VideoStudioStep = ({editPreviewSwitched, stepIndex}) => (
    <Fragment>
        {getCurrentStep(editPreviewSwitched, stepIndex)}
    </Fragment>
);

export default VideoStudioStep;
