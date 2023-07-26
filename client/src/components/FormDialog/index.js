
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// for modal performance
const FormDialogBody = ({ closed, title, content, label, disagreeButtonCaption, agreeButtonCaption }) => {
    return (
        <Fragment>
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="form-dialog"
                    label={label}
                    fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={closed} color="primary">
                    { disagreeButtonCaption || 'Cancel' }
                </Button>
                <Button onClick={closed} color="primary">
                    { agreeButtonCaption || 'OK' }
                </Button>
            </DialogActions>
        </Fragment>
    );
};

const FormDialog = ({ opened, closed, title, content, label, disagreeButtonCaption, agreeButtonCaption }) => {
    return (
        <Dialog
            fullWidth
            open={opened}
            onClose={closed}
            aria-labelledby="form-dialog-title">
            <FormDialogBody 
                closed={closed}
                title={title}
                content={content}
                label={label}
                disagreeButtonCaption={disagreeButtonCaption}
                agreeButtonCaption={agreeButtonCaption} />
        </Dialog>
    );
}

export default FormDialog;
