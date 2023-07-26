
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { setMobileFullWidth, getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    let root = {
        padding: spacingUnit / 2
    };
    const desktopSpecific = {
        display: 'inline-block'
    };
    root = setMobileFullWidth('sm', theme, root, desktopSpecific);
    
    return { root };
};

const ContainedButton = ({ classes, clicked, children, primary, secondary, disablePropagation, ...other }) => {
    let buttonTheme;
    if (primary && !secondary) {
        buttonTheme = 'primary';
    }
    if (!primary && secondary) {
        buttonTheme = 'secondary';
    }
    if (!buttonTheme) {
        throw new Error('Neither primary nor secondary button is invalid.');
    }

    const clickHandler = event => {
        if (disablePropagation) {
            event.stopPropagation();
        }
        clicked();
    };

    return (
        <div className={classes.root}>
            <Button
                fullWidth
                onClick={clickHandler}
                variant="contained"
                color={buttonTheme}
                {...other}>
                {children}
            </Button>
        </div>
    );
};

export default withStyles(styles)(ContainedButton);
