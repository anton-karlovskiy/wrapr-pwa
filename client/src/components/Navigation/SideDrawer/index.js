
import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

import NavigationItems from '../NavigationItems'

const styles = {
  list: {
    width: 250
  }
};

const SideDrawer = ({ classes, opened, closed }) => {
  return (
    <Drawer open={opened} onClose={closed}>
      <div
        tabIndex={0}
        role="button"
        onClick={closed}
        onKeyDown={closed}>
          <div className={classes.list}>
            <NavigationItems />
          </div>
      </div>
    </Drawer>
  );
}

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideDrawer);