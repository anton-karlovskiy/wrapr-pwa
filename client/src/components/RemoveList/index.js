
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/TrackChanges';

import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const root = {
        backgroundColor: theme.palette.background.paper
    };
    const spacingUnit = getSpacingUnit(theme);
    const listItemTextStyle = {
        maxWidth: '75%',
        padding: 0,
        paddingLeft: spacingUnit / 2,
        paddingRight: spacingUnit / 2
    };
    return { root, listItemTextStyle }
};

const RemoveList = ({ classes, list }) => {
    return (
        <div className={classes.root}>
            <List dense={false}>
                { list.map(item => (
                    <ListItem key={item.title}>
                        <ListItemAvatar>
                            <Avatar>
                                <ImageIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.listItemTextStyle}
                            primary={item.title}
                            secondary={item.subTitle} />
                        <ListItemSecondaryAction>
                            { item.subHandler && (
                                <IconButton onClick={item.subHandler} aria-label="Update">
                                    <UpdateIcon />
                                </IconButton>
                            ) }
                            <IconButton onClick={item.handler} aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )) }
            </List>
        </div>
    );
};

export default withStyles(styles)(RemoveList);
