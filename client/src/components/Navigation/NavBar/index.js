
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Logo from '../../Logo'
import NavigationItems from '../NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle';
import BottomBanner from '../BottomBanner';
import { logoutUser } from '../../../actions/authentication';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        display: 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            minWidth: 328
        }
    }
});

const NavBar = ({ classes, drawerToggleClicked }) => {
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <DrawerToggle clicked={drawerToggleClicked} mobileBehavior={classes.menuButton} />
                    <Logo />
                    <div className={classes.grow} />
                    <NavigationItems desktopBehavior={classes.sectionDesktop} />
                </Toolbar>
                <BottomBanner />
            </AppBar>
        </div>
    );
};

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logoutUser})(withRouter(withStyles(styles)(NavBar)));
