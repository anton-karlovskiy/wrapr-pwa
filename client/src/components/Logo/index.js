
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MobileFriendly from '@material-ui/icons/MobileFriendly';

const homeNavHandler = history => {
    history.push('/create-template');
}

const styles = {
    handCursor: {
        cursor: 'pointer'
    },
    positioning: {
        marginTop: 3,
        marginRight: 3
    },
    upperCase: {
        textTransform: 'uppercase'
    }
}

const Logo = ({ classes, history }) => {
    return (
        <Box display="flex" className={classes.handCursor} onClick={() => homeNavHandler(history)}>
            <MobileFriendly className={classes.positioning} />
            <Typography className={classes.upperCase} variant="h6" color="inherit">
                Video
            </Typography>
            <Typography className={classes.upperCase} variant="h6" color="secondary">
                Wrappr
            </Typography>
        </Box>
    );
};

export default withStyles(styles)(withRouter(Logo));