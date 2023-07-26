
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from "react-dom";
import AddIcon from '@material-ui/icons/NoteAdd';
import UpdateIcon from '@material-ui/icons/TrackChanges';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import RemoveList from '../../../RemoveList';
import ValidationNumberField from './ValidationNumberField';
import IconContainedButton from '../../../IconContainedButton';
import RightIconWrapper from '../../../../hoc/RightIconWrapper';
import { convertDurationString, setMobileFlexSwitch, setResponsiveStyle } from '../../../../utils/utility';
import AlertDialog from '../../../AlertDialog';
import { addSubtitle, updateSubtitle, removeSubtitle } from '../../../../actions/videoStepper';

const styles = theme => {
    const mobileFromToStyle = {
        width: '100%'
    };
    const desktopFromToStyle = {
        width: '40%'
    };
    const fromToStyle = setResponsiveStyle('md', theme, mobileFromToStyle, desktopFromToStyle);
    const root = setMobileFlexSwitch('md', theme, {});
    return { root, fromToStyle };
};

// TODO: could need polyfill for browser compatibility
class Subtitles extends Component {
    state = {
        subtitleInput: '',
        fromInput: '',
        toInput: '',
        alertOpen: false,
        alertMessages: []
    };
    subTitleInputElement = React.createRef();

    componentDidMount() {
        if (this._subtitles) {
            const DOMNode = ReactDOM.findDOMNode(this._subtitles);
            this._track = DOMNode.addTextTrack('subtitles', 'let us add subtitles', 'en');
            this._track.mode = 'showing'; // set track to display
        }
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.videoStepperSubtitles !== this.props.videoStepperSubtitles) && this._subtitles) {
            const beforeCopyTrackCues = {...this._track.cues};
            const removeCueHandler = cue => {
                this._track.removeCue(cue);
            }
            Object.keys(beforeCopyTrackCues).forEach(key => {
                removeCueHandler(beforeCopyTrackCues[key]);
            });

            const { videoStepperSubtitles } = this.props;
            videoStepperSubtitles.forEach(videoStepperSubtitle => {
                const { from, to, text } = videoStepperSubtitle;
                const newVTTCue = new VTTCue(from, to, text);
                this._track.addCue(newVTTCue);
            });
        }
    }

    validateFromTo = (fromInput, toInput) => {
        let messages = [];
        if (fromInput === '' || toInput === '' || isNaN(fromInput) || isNaN(toInput)) {
            messages = [
                ...messages,
                'From time and To time must be filled properly.'
            ];
            return messages;
        }
        const { videoStepperVideo: {duration} } = this.props;

        if (fromInput < 0 || toInput < 0) {
            messages = [
                ...messages,
                'From time and To time must be bigger than 0.'
            ];
            return messages;
        }

        if (fromInput > duration || toInput > duration) {
            messages = [
                ...messages,
                'From time and To time must be less than video length.'
            ];
            return messages;
        }

        if (fromInput >= toInput) {
            messages = [
                ...messages,
                'From time must be less than To time.'
            ];
            return messages;
        }

        const { videoStepperSubtitles } = this.props;
        let targetIndex = -1;
        // TODO: break implementation for performance
        videoStepperSubtitles.forEach((videoStepperSubtitle, index) => {
            const { from, to } = videoStepperSubtitle;
            if ((fromInput >= from && fromInput < to) || (toInput > from && toInput <= to) || (fromInput <= from && toInput >= to)) {
                targetIndex = index;
            }
        });
        if (targetIndex > -1) {
            messages = [
                ...messages,
                'There is overlapped subtitle.'
            ];
            return messages;
        }

        return null;
    };

    subtitleInputChangeHandler = event => {
        this.setState({subtitleInput: event.target.value});
    };

    fromInputChangeHandler = fromInput => {
        if (fromInput < 0) {
            fromInput = 0;
        }
        // TODO: could be better to convert to integer
        fromInput = parseFloat(parseFloat(fromInput).toFixed(3));
        this.setState({fromInput});
    };

    toInputChangeHandler = toInput => {
        if (toInput < 0) {
            toInput = 0;
        }
        // TODO: could be better to convert to integer
        toInput = parseFloat(parseFloat(toInput).toFixed(3));
        this.setState({toInput});
    };

    shouldAddSubtitle = () => {
        const { fromInput, toInput, subtitleInput } = this.state;
        const { videoStepperSubtitles } = this.props;

        let shouldWe = false;
        let subtitleExists = false;
        videoStepperSubtitles.forEach(videoStepperSubtitle => {
            if (videoStepperSubtitle.from === fromInput && videoStepperSubtitle.to === toInput) {
                subtitleExists = true;
            }
        });

        if (!subtitleExists && subtitleInput !== '' && (fromInput !== '' && !isNaN(fromInput)) && (toInput !== '' && !isNaN(toInput))) {
            shouldWe = true;
        }

        return shouldWe;
    };

    shouldUpdateSubtitleWithIndex = () => {
        const { fromInput, toInput, subtitleInput } = this.state;
        const { videoStepperSubtitles } = this.props;

        let shouldWe = false;
        let updateIndex = -1;
        videoStepperSubtitles.forEach((videoStepperSubtitle, index) => {
            if (videoStepperSubtitle.from === fromInput && videoStepperSubtitle.to === toInput && subtitleInput !== '' && videoStepperSubtitle.text !== subtitleInput) {
                shouldWe = true;
                updateIndex = index;
            }
        });

        return {shouldWe, updateIndex};
    };

    subtitleAddHandler = () => {
        const { fromInput, toInput, subtitleInput } = this.state;
        const { addSubtitle } = this.props;
        const validationMessages = this.validateFromTo(fromInput, toInput);
        if (validationMessages && validationMessages.length > 0) {
            this.setState({alertOpen:true, alertMessages: validationMessages});
            return;
        }
        const subtitle = {from: fromInput, to: toInput, text: subtitleInput};
        addSubtitle(subtitle);
    };

    subtitleUpdateHandler = updateIndex => {
        const { fromInput, toInput, subtitleInput } = this.state;
        const { updateSubtitle } = this.props;
        const newSubtitle = {from: fromInput, to: toInput, text: subtitleInput};
        updateSubtitle(newSubtitle, updateIndex);
    };

    subtitleRemoveHandler = removeIndex => {
        const { removeSubtitle } = this.props;
        removeSubtitle(removeIndex);
    };

    focusOnSubtitleInput = subtitle => {
        this.subTitleInputElement.current.focus();
        const { from, to, text } = subtitle;
        this.setState({fromInput: from, toInput: to, subtitleInput: text});
    };

    alertClosehandler = () => {
        this.setState({alertOpen: false});
    };

    render() {
        const { classes, videoStepperSubtitles, videoStepperVideo } = this.props;
        const { fromInput, toInput, alertOpen, alertMessages } = this.state;
        const { shouldWe: shouldUpdateSubtitle, updateIndex } = this.shouldUpdateSubtitleWithIndex();
        const removeSubtitleList = videoStepperSubtitles.map((videoStepperSubtitle, index) => {
            const fromString = convertDurationString(videoStepperSubtitle.from);
            const toString = convertDurationString(videoStepperSubtitle.to);
            return {
                title: `${fromString} - ${toString} : "${videoStepperSubtitle.text}"`,
                handler: () => this.subtitleRemoveHandler(index),
                subHandler: () => this.focusOnSubtitleInput(videoStepperSubtitle)
            };
        });
        return (
            <Fragment>
                <AlertDialog
                    opened={alertOpen}
                    closed={this.alertClosehandler}
                    content={alertMessages} />
                <video
                    ref={r => { this._subtitles = r; }}
                    controls
                    src={videoStepperVideo.url}
                    preload="auto"
                    width="100%" />
                <Box className={classes.root}>
                    <Box className={classes.fromToStyle} display="flex">
                        <Box flexGrow={1} pl={1} pr={1}>
                            <ValidationNumberField
                                labelText="From(sec)"
                                value={fromInput}
                                changed={this.fromInputChangeHandler} />
                        </Box>
                        <Box flexGrow={1} pl={1} pr={1}>
                            <ValidationNumberField
                                labelText="To(sec)"
                                value={toInput}
                                changed={this.toInputChangeHandler} />
                        </Box>
                    </Box>
                    <Box pl={1} pr={1} flexGrow={1}>
                        <TextField
                            required // TODO: required validation
                            inputRef={this.subTitleInputElement}
                            fullWidth
                            id="subtitle"
                            label="Subtitle"
                            value={this.state.subtitleInput}
                            onChange={this.subtitleInputChangeHandler}
                            margin="dense"
                            variant="outlined" />
                    </Box>
                </Box>
                <div>
                    { this.shouldAddSubtitle() && (
                        <IconContainedButton
                            secondary
                            clicked={this.subtitleAddHandler}>
                            Add
                            <RightIconWrapper>
                                <AddIcon />
                            </RightIconWrapper>
                        </IconContainedButton>
                    ) }
                    { shouldUpdateSubtitle && (
                        <IconContainedButton
                            secondary
                            clicked={() => this.subtitleUpdateHandler(updateIndex)}>
                            Update
                            <RightIconWrapper>
                                <UpdateIcon />
                            </RightIconWrapper>
                        </IconContainedButton>
                    )}
                </div>
                <RemoveList list={removeSubtitleList} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    videoStepperVideo: state.videoStepper.video,
    videoStepperSubtitles: state.videoStepper.subtitles
});
const mapActionToProps = {
    addSubtitle,
    updateSubtitle,
    removeSubtitle
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Subtitles));
