
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { getSpacingUnit } from '../../../../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const labelStyle = {
        marginTop: spacingUnit,
        marginBottom: spacingUnit * 1.25
    };

    return {
        root : {
            width: '100%'
        },
        labelStyle
    };
};

const RadioButtonsGroup = ({ classes, direction, radioChanged, checked, radioButtons }) => {
    const onChangeHandler = event => {
        radioChanged(event);
    };

    const flexDirection = {flexDirection: direction};
    return (
        <FormControl className={classes.root} component="fieldset">
            <RadioGroup
                style={flexDirection}
                value={checked}
                onChange={onChangeHandler}>
                { radioButtons.map(radioButton => (
                    <FormControlLabel
                        key={radioButton.value}
                        className={classes.labelStyle}
                        value={radioButton.value}
                        control={<Radio />}
                        label={radioButton.label} />
                )) }
            </RadioGroup>
        </FormControl>
    );
}

RadioButtonsGroup.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RadioButtonsGroup);
