
import React from 'react';
import TextField from '@material-ui/core/TextField';

const SelectTextField = ({ label, selected, list, selectionChanged }) => {
    const onSelectionChangeHandler = event => {
        selectionChanged(event);
    };

    return (
        <TextField
            fullWidth
            id={null}
            select
            label={label}
            value={selected}
            onChange={onSelectionChangeHandler}
            SelectProps={{
                native: true
            }}
            margin="dense"
            variant="outlined">
                { list.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                )) }
        </TextField>
    );
};

export default SelectTextField;