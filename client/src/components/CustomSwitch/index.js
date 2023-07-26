
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
    root: {
        margin: 0,
        display: 'flex'
    },
    colorSwitchBase: {
        
        color: theme.palette.primary.main,
        '&$colorChecked': {
            color: theme.palette.primary.dark,
            '& + $colorBar': {
                backgroundColor: theme.palette.primary.dark
            }
        }
    },
    colorChecked: {}
});

const CustomSwitch = ({ classes, checked, editPreviewSwitched }) => {
    const onChangeHandler = event => {
        editPreviewSwitched();
    };

    return (
        <FormControlLabel
            className={classes.root}
            control={ (
                <Switch
                    checked={checked}
                    onChange={onChangeHandler}
                    value="checkedA"
                    classes={{
                        switchBase: classes.colorSwitchBase,
                        checked: classes.colorChecked
                    }} />
            ) }
            labelPlacement="start"
            label={!checked ? 'Preview' : 'Edit'} />
    );
};

CustomSwitch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomSwitch);
