
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import { Typography } from '@material-ui/core';

import PaperLayer from '../../hoc/PaperLayer';
import { getSpacingUnit } from '../../utils/utility';
import IconContainedButton from '../IconContainedButton';
import RightIconWrapper from '../../hoc/RightIconWrapper';
import { getFileRestUrl, deleteFile } from '../../utils/api';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden'
        },
        title: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0
        },
        gridListSize: {
            width: '100%',
            height: spacingUnit * 60
        },
        actionButtons: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        gridListTileImageModifier: {
            width: '100%',
            height: 'auto'
        },
        gridListTileBarStyle: {
            height: 'auto'
        }
    }
};

const getGridListCols = width => {
    if (isWidthUp('xl', width)) {
        return 4;
    }
    if (isWidthUp('lg', width)) {
        return 3;
    }
    if (isWidthUp('md', width)) {
        return 2;
    }

    return 1;
};

const ImageGrid = ({
    classes,
    width,
    title,
    imageList,
    selectHandler,
    deleteHandler,
    gridCellHeight,
    gridListSizeOverride
}) => {
    const onSelectHandler = tile => {
        selectHandler(tile);
    };

    const onDeleteHandler = tile => {
        // TODO: module needed to delete public assets unlike private assets
        if (deleteHandler) {
            const deleteFileUrl = getFileRestUrl(tile._id);
            deleteFile(deleteFileUrl, deleteHandler);
        }
    };

    const actionButtons = tile => (
        <div className={classes.actionButtons}>
            <IconContainedButton
                secondary
                clicked={() => onSelectHandler(tile)}>
                Select
                <RightIconWrapper>
                    <SendIcon />
                </RightIconWrapper>
            </IconContainedButton>
            { deleteHandler && (
                <IconContainedButton
                    error
                    clicked={() => onDeleteHandler(tile)}>
                    Delete
                    <RightIconWrapper>
                        <DeleteIcon />
                    </RightIconWrapper>
                </IconContainedButton>
            ) }
        </div>
    );

    // descending order
    let copyImageList = [...imageList];
    copyImageList = copyImageList.reverse();
    
    return (
        <PaperLayer>
            <div className={classes.root}>
                <GridList
                    style={gridListSizeOverride}
                    className={classes.gridListSize}
                    cellHeight={gridCellHeight}
                    spacing={8}
                    cols={getGridListCols(width)}>
                    <GridListTile key="Subheader" cols={getGridListCols(width)} style={{ height: 'auto' }}>
                        <ListSubheader className={classes.title} component="div">
                            {title}
                        </ListSubheader>
                    </GridListTile>
                    { copyImageList.length > 0 ? copyImageList.map(tile => (
                        <GridListTile
                            key={tile._id}>
                            <img
                                className={classes.gridListTileImageModifier}
                                src={tile.url}
                                alt={tile.type} />
                            <GridListTileBar
                                className={classes.gridListTileBarStyle}
                                title={tile.title}
                                subtitle={<span>{tile.subTitle}</span>}
                                actionIcon={
                                    actionButtons(tile)
                                } />
                        </GridListTile>
                    )) : (
                        <Typography>No images</Typography>
                    ) }
                </GridList>
            </div>
        </PaperLayer>
    );
}

ImageGrid.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles)(ImageGrid));
