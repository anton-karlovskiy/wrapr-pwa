
import React, { Component } from "react";
import { Rnd } from "react-rnd";
import { withStyles } from '@material-ui/core/styles';

import videoRNDOutline from '../../assets/images/outline.png';
import { videoStudioSteps, initialElementPosition } from '../../utils/links';
import { getPhysicalSize, getPhysicalPos, elementSizePosSet } from '../../utils/utility';

const styles = {
    RNDWrapperHandle: {
        margin: 0,
        padding: 0,
        height: '100%',
        border: '1px dashed red',
        backgroundImage: `url(${videoRNDOutline})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    }
};

class RNDWrapper extends Component {
    componentDidMount() {
        const { element } = this.props;
        if (!elementSizePosSet(element)) {
            this.handleElementInitialSizePos();
        } 
    }

    componentDidUpdate(prevProps) {
        // scale is updated
        if (this.props.scale !== prevProps.scale) {
            this.handleElementInitialSizePos();
        }
    }

    handleElementInitialSizePos = () => {
        const { stepIndex } = this.props;
        switch(stepIndex) {
            case videoStudioSteps[1].index:
                this.handleVideoInitialSizePos();
                break;
            case videoStudioSteps[2].index:
            case videoStudioSteps[4].index:
                this.handleImageInitialSizePos();
                break;
            case videoStudioSteps[3].index:
                this.handleBase64InitialSizePos();
                break;
            default:
                throw new Error('Invalid video studio step.');
        }
    };

    convertSizeString = str => {
        const trimmed = str.replace("px");
        const numerical = parseInt(trimmed, 10);
        return numerical;
    };

    // calculate element's possible representational size to fit the canvas
    calcFullFitSize = (containerSize, containeeSize) => {
        const scalePriority = {
            horizontal: 'horizontal',
            vertical: 'vertical'
        };
        let scalePriorityValue, scaleAmount;
        const { width: containerWidth, height: containerHeight } = containerSize;
        const { width: containeeWidth, height: containeeHeight } = containeeSize;
        const widthScale = containerWidth / containeeWidth;
        const heightScale = containerHeight / containeeHeight;
        
        scalePriorityValue = widthScale > heightScale ? scalePriority.vertical : scalePriority.horizontal;

        if (scalePriorityValue === scalePriority.horizontal) {
            scaleAmount = widthScale;
        } else if (scalePriorityValue === scalePriority.vertical) {
            scaleAmount = heightScale;
        }

        const calculatedWidth = parseInt(scaleAmount * containeeWidth, 10);
        const calculatedHeight = parseInt(scaleAmount * containeeHeight, 10);
        return {width: calculatedWidth, height: calculatedHeight};
    };

    initializeElementFullSizePos = (elementSize, zoom = 1) => {
        const { scale, updateSizePos } = this.props;
        if (scale) {
            const { logicalCanvasSize: { width: logicalCanvasWidth, height: logicalCanvasHeight } } = this.props;
            const physicalCanvasSize = {width: logicalCanvasWidth / scale, height: logicalCanvasHeight / scale};
            const { width, height } = this.calcFullFitSize(physicalCanvasSize, elementSize);
            updateSizePos && updateSizePos({
                width: width * zoom,
                height: height * zoom,
                ...initialElementPosition
            });
        }
    };

    handleVideoInitialSizePos = () => {
        const { element: { intrinsicWidth: width, intrinsicHeight: height } } = this.props;
        const elementSize = {width, height};
        this.initializeElementFullSizePos(elementSize);
    };

    handleImageInitialSizePos = () => {
        const { element: { intrinsicWidth: width, intrinsicHeight: height } } = this.props;
        const elementSize = {width, height};
        this.initializeElementFullSizePos(elementSize, .5);
    };

    handleBase64InitialSizePos = () => {
        const { element: { dataUrl }, updateSizePos } = this.props;
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const { width, height } = img;
            updateSizePos && updateSizePos({
                width,
                height,
                ...initialElementPosition
            });
        };
    };

    render() {
        const { element, updateSizePos, scale } = this.props;
        if (!elementSizePosSet(element)) {
            console.log('ray : [RNDWrapper render] redux size pos not set so null');
            return null;
        }

        const { classes, lockRatio } = this.props;
        const { width, height, x, y } = element;
        const elementPhysicalSize = getPhysicalSize({width, height}, scale);
        const elementPhysicalPos = getPhysicalPos({x, y}, scale);

        const sizeSet = {...elementPhysicalSize};
        const positionSet = {...elementPhysicalPos};
        return (
            <Rnd
                lockAspectRatio={lockRatio}
                size={sizeSet}
                position={positionSet}
                onDragStop={(e, d) => {
                    updateSizePos && updateSizePos({...sizeSet, x: d.x, y: d.y});
                }}
                onResize={(e, direction, ref, delta, position) => {
                    updateSizePos && updateSizePos({
                        width: this.convertSizeString(ref.style.width),
                        height: this.convertSizeString(ref.style.height),
                        ...position
                    });
                }}
                bounds="parent">
                    <div className={classes.RNDWrapperHandle}>
                        {this.props.children}
                    </div>
            </Rnd>
        );
    }
}

export default withStyles(styles)(RNDWrapper);
