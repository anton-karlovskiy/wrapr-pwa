
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { getSpacingUnit } from '../../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    let root = { borderRadius: spacingUnit * 2 };

    return { root };
};

const NavigationButton = ({classes, children, link, primaryColor}) => {
    // alternative to back button if link unavailable
    if (!link) {
        return (
            <Button
                color={primaryColor ? 'primary' : 'secondary'}
                className={classes.root} variant="outlined"
                onClick={() => {window.history.go(-1)}}>
                {children}
            </Button>
        );
    }

    const MyLink = props => (<Link to={link} {...props} />);
    return (
        <Button
            color={primaryColor ? 'primary' : 'secondary'}
            className={classes.root} variant="outlined"
            component={MyLink}>
            {children}
        </Button>
    );
};

NavigationButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationButton);
