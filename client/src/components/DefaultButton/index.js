
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        root: {
            marginRight: spacingUnit,
            marginTop: spacingUnit
        }
    };
};

const DefaultButton = ({clicked, children, styleClass, ...other}) => (
    <Button
        size="medium"
        onClick={clicked}
        className={styleClass}
        {...other}>
        {children}
    </Button>
);

export default withStyles(styles)(DefaultButton);