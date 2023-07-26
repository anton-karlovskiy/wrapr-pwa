
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const DrawerToggle = ({mobileBehavior, clicked}) => (
    <IconButton onClick={clicked} className={mobileBehavior} color="inherit" aria-label="Menu">
        <MenuIcon />
    </IconButton>
);

export default DrawerToggle;
