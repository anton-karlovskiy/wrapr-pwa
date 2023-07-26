
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import { getSpacingUnit, setMobileFullWidth } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    let root = {
        padding: spacingUnit / 2
    };
    const desktopSpecific = {
        display: 'inline-block'
    };
    const fontColor = {
        color: '#fff',
    };
    root = setMobileFullWidth('sm', theme, root, desktopSpecific);

    return {
        root,
        fontColor,
        primaryStyle: {
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark
            }
        },
        secondaryStyle: {
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
                backgroundColor: theme.palette.secondary.dark
            }
        },
        errorStyle: {
            backgroundColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark
            }
        }
    }
};

const IconContainedButton = ({ classes, clicked, primary, secondary, error, children, ...other }) => {
    let colorStyle;
    if (primary && !secondary && !error) {
        colorStyle = classes.primaryStyle;
    }
    if (!primary && secondary && !error) {
        colorStyle = classes.secondaryStyle;
    }
    if (!primary && !secondary && error) {
        colorStyle = classes.errorStyle;
    }
    if (!colorStyle) {
        throw new Error('Neither primary nor secondary nor error button is invalid.');
    }

    return (
        <div className={classes.root}>
            <Button
                fullWidth
                onClick={clicked}
                variant="contained"
                {...other}
                className={classNames(classes.fontColor, colorStyle)}>
                {children}
            </Button>
        </div>
    );
};

export default withStyles(styles)(IconContainedButton);
