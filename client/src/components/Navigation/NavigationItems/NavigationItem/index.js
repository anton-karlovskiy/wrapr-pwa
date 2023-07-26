
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    selected: {
        color: '#FFF'
    },
    itemLabel: {
        padding: 0,
        textAlign: 'center'
    }
};

const ListItemLink = props => {
    return <ListItem button {...props} />;
};

const NavigationItem = ({icon, children, classes, onMobileBehavior, history, link}) => {
    return (
        <li>
            <ListItemLink
                selected={history.location.pathname === link}
                onClick={() => history.push(link)}>
                {onMobileBehavior && icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText
                    className={classes.itemLabel}
                    primary={children} 
                    classes={!onMobileBehavior ? { primary: classes.selected } : null}/>
            </ListItemLink>
        </li>
    );
};

export default withStyles(styles)(withRouter(NavigationItem));
