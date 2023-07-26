
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// for modal performance
const AlertDialogBody = ({ closed, title, content }) => {
    return (
        <Fragment>
            <DialogTitle id="alert-dialog-title">{title || 'VideoWrappr Says'}</DialogTitle>
            <DialogContent>
                { content.map(string => (
                    <DialogContentText key={string} id="alert-dialog-description">
                        {string}
                    </DialogContentText>
                )) }
            </DialogContent>
            <DialogActions>
                <Button onClick={closed} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Fragment>
    );
};

const AlertDialog = ({ opened, closed, title, content }) => {
    return (
        <Dialog
            fullWidth
            open={opened}
            onClose={closed}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <AlertDialogBody closed={closed} title={title} content={content} />
        </Dialog>
    );
};

export default AlertDialog;