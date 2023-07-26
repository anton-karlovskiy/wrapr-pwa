
import React from 'react';
import TextField from '@material-ui/core/TextField';

const FontSelectTextField = ({ label, selected, list, selectionChanged }) => {
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
            inputProps={{style: {fontFamily: selected}}}
            margin="dense"
            variant="outlined">
                { list.map(option => (
                    <option style={{fontFamily: option.fontFamily}} key={option.ttf} value={option.fontFamily}>
                        {option.fontFamily}
                    </option>
                )) }
        </TextField>
    );
};

export default FontSelectTextField;