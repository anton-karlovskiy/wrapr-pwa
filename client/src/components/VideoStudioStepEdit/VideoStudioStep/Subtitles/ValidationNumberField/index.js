
import React from 'react';
import TextField from '@material-ui/core/TextField';

const ValidationNumberField = ({ changed, errorText, labelText, value }) => {
    const onChangeHandler = event => {
        changed && changed(event.target.value);
    };

    return (
        <TextField
            fullWidth
            required // TODO: required validation
            id="validation-text-field"
            type="number"
            error={errorText}
            value={value}
            InputLabelProps={{
                shrink: true
            }}
            label={errorText || labelText}
            onChange={onChangeHandler}
            margin="dense"
            variant="outlined" />
    );
};

export default ValidationNumberField;
