
import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { getSpacingUnit } from '../../utils/utility';

const DialogTitle = withStyles(theme => {
    const spacingUnit = getSpacingUnit(theme);
    const root = {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: spacingUnit * 2
    };
    const closeButton = {
        position: 'absolute',
        right: spacingUnit,
        top: spacingUnit,
        color: theme.palette.grey[500]
    };
    return {root, closeButton};
})(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => {
    const spacingUnit = getSpacingUnit(theme);
    const root = {
        margin: 0,
        padding: spacingUnit / 4
    };
    return {root};
})(MuiDialogContent);

const DialogActions = withStyles(theme => {
    const spacingUnit = getSpacingUnit(theme);
    const root = {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: spacingUnit
    };
    return {root};
})(MuiDialogActions);

// for modal performance
const CustomizedDialogBody = ({ closed, title, content }) => {
    return (
        <Fragment>
            <DialogTitle id="customized-dialog-title" onClose={closed}>
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={closed} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Fragment>
    );
};

const CustomizedDialog = ({ opened, closed, title, content }) => {
    return (
        <Dialog
            fullScreen
            open={opened}
            onClose={closed}
            aria-labelledby="customized-dialog-title">
            <CustomizedDialogBody closed={closed} title={title} content={content} />
        </Dialog>
    );
}

export default withMobileDialog({breakpoint: 'md'})(CustomizedDialog);
