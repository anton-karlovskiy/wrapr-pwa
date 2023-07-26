
import React from 'react';
import Box from '@material-ui/core/Box';

const RightIconWrapper = ({ children }) => {
    return (
        <Box display="flex" pl={1}>
            {children}
        </Box>
    );
};

export default RightIconWrapper;