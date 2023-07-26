
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column'
    }
};

const TextsGroup = ({ classes, textFields, textChanged }) => {
    const onTextChangeHandler = value => event => {
        textChanged(value, event);
    };

    return (
        <div className={classes.root}>
            { textFields.map(textField => (
                <TextField
                    // TODO: hardcoded for tuning
                    inputProps={{style: {height: 18}}}
                    key={textField.textLabel}
                    id={textField.textLabel}
                    label={textField.textLabel}
                    value={textField.textValue}
                    onChange={onTextChangeHandler(textField.value)}
                    margin="dense"
                    variant="outlined" />
            )) }
        </div>
    );
};

export default withStyles(styles)(TextsGroup);
