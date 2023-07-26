
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        root: {
            minHeight: '100%',
            padding: spacingUnit / 2
        }
    }
}

const PaperLayer = ({ classes, children, elevation }) => (
    <Paper square elevation={ elevation || 0 } className={classes.root}>
        {children}
    </Paper>
);

export default withStyles(styles)(PaperLayer);
