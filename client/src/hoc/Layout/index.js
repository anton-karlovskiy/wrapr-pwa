
import React, { Component, Fragment } from 'react';
import { withStyles } from "@material-ui/core/styles";

import NavBar from '../../components/Navigation/NavBar';
import SideDrawer from '../../components/Navigation/SideDrawer';
import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const mainAroundOffset = spacingUnit;
    const mainTopOffset = spacingUnit * 1;
    return {
        root: {
            padding: mainAroundOffset,
            paddingTop: mainTopOffset
        }
    };
};

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    }

    sideDrawerToggleHandler = () => {
        this.setState(prevState => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        const { classes } = this.props;
        return (
            <Fragment>
                <NavBar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    opened={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <main className={classes.root}>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
}

export default withStyles(styles)(Layout);