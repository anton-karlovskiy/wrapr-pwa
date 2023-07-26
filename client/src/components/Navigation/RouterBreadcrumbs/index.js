
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import NoSsr from '@material-ui/core/NoSsr';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from "@material-ui/icons/Home"
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router-dom';

import { getBreadCrumbName } from '../../../utils/links';
import NavigationButton from '../NavigationButton';
import { getNavAssistButtons, pageLinks } from '../../../utils/links';
import { getSpacingUnit } from '../../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const root = {
        flexDirection: 'row'
    };
    const chip = {
        backgroundColor: theme.palette.grey[200],
        height: 24,
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: theme.palette.grey[300]
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12)
        }
    };
    const avatar = {
        background: "none",
        marginRight: -spacingUnit * 1.5
    };
    return {root, chip, avatar};
};

const handleClick = (pathname, history) => {
    history.push(pathname);
}

const CustomBreadcrumb = (props) => {
    const { classes, ...rest } = props;
    return <Chip className={classes.chip} {...rest} />;
}

CustomBreadcrumb.propTypes = {
    classes: PropTypes.object.isRequired
};

const StyledBreadcrumb = withStyles(styles)(CustomBreadcrumb);

const RouterBreadcrumbs = ({classes, history}) => {
    // Use NoSsr to avoid SEO issues with the documentation website.
    const pathnames = history.location.pathname.split('/').filter(x => x);
    const navAssistButtons = getNavAssistButtons(history.location.pathname);
    return (
        <Box className={classes.root} display="flex" p={1}>
            <Box p={1}
                display="flex"
                alignItems="center"
                flexGrow={1}>
                <NoSsr>
                    <Breadcrumbs arial-label="Breadcrumb">
                        <StyledBreadcrumb
                            label="Home"
                            avatar={
                                <Avatar className={classes.avatar}>
                                    <HomeIcon />
                                </Avatar>
                            }
                            onClick={ () => handleClick(pageLinks.WrapperList.url, history) } />
                        { pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                            return last ? (
                                <StyledBreadcrumb 
                                    key={to}
                                    label={ getBreadCrumbName(to) } />
                                ) : (
                                <StyledBreadcrumb 
                                    key={to}
                                    label={ getBreadCrumbName(to) }
                                    onClick={ () => handleClick(to, history) } />
                            );
                        }) }
                    </Breadcrumbs>
                </NoSsr>
            </Box>
            { navAssistButtons && navAssistButtons.map(button => (
                <Box key={button.title} p={1}>
                    <NavigationButton link={button.link} primaryColor={button.primaryColor}>{button.title}</NavigationButton>
                </Box>
            )) }
        </Box>
    );
}

RouterBreadcrumbs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(RouterBreadcrumbs));