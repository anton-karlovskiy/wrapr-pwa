
import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    cursorPointer: {
        cursor: 'pointer'
    }
};

// TODO: could be a functional
class ResponsiveVideoPlayer extends Component {
    updateDuration = duration => {
        const { durationHandler } = this.props;
        if (durationHandler) {
            durationHandler(duration);
        }
    };

    preventClickPlay = tapPlay => event => {
        if (!tapPlay) {
            event.preventDefault();
        }
    };

    render () {
        const { classes, source, controls, tapPlay } = this.props;
        const rootClass = classNames({[classes.cursorPointer]: tapPlay});
        return (
            <div className={rootClass}>
                <ReactPlayer
                    onDuration={this.updateDuration}
                    controls={controls}
                    onClick={this.preventClickPlay(tapPlay)}
                    width="100%"
                    height="auto"
                    url={source} />
            </div>
        );
    }
}

export default withStyles(styles)(ResponsiveVideoPlayer);
