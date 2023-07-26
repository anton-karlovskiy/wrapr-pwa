
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { getSpacingUnit, setResponsiveStyle } from '../../../../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const mobileLabelFontStyle = {
        fontSize: '0.75rem',
    };
    const desktopLabelFontStyle = {
        fontSize: '0.875rem', // TODO: hardcoded
    };
    const mobileLabelStyle = {
        marginRight: spacingUnit / 2 * 3,
        flexGrow: 1
    };
    const desktopLabelStyle = {
        flexGrow: 0
    };
    const labelStyle = setResponsiveStyle('sm', theme, mobileLabelStyle, desktopLabelStyle);
    const labelFontStyle = setResponsiveStyle('sm', theme, mobileLabelFontStyle, desktopLabelFontStyle);

    return {
        root : {
            width: '100%'
        },
        groupStyle: {
            padding: `${spacingUnit}px ${spacingUnit / 2}px`,
        },
        labelStyle,
        radioStyle: {
            paddingTop: spacingUnit / 2,
            paddingBottom: spacingUnit / 2,
            paddingLeft: spacingUnit / 2 * 3,
            paddingRight: spacingUnit
        },
        labelFontStyle
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
                className={classes.groupStyle}
                value={checked}
                onChange={onChangeHandler}>
                { radioButtons.map(radioButton => (
                    <FormControlLabel
                        key={radioButton.value}
                        classes={{label: classes.labelFontStyle}}
                        className={classes.labelStyle}
                        value={radioButton.value}
                        control={<Radio className={classes.radioStyle} />}
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
