
import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveVideoPlayer from '../ResponsiveVideoPlayer';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeleteIcon from '@material-ui/icons/Delete';
import SelectIcon from '@material-ui/icons/Send';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { Typography } from '@material-ui/core';

import IconContainedButton from '../IconContainedButton';
import PaperLayer from '../../hoc/PaperLayer';
import RightIconWrapper from '../../hoc/RightIconWrapper';
import { getSpacingUnit } from '../../utils/utility';
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

const VideoGrid = ({
    classes,
    width,
    title,
    videoList,
    selectHandler,
    downloadHandler,
    deleteHandler,
    gridCellHeight,
    gridListSizeOverride
}) => {
    const onSelectHandler = tile => {
        selectHandler(tile);
    };

    const onDownloadHandler = tile => {
        downloadHandler(tile);
    };

    const onDeleteHandler = tile => {
        // TODO: module needed to delete public assets unlike private assets
        if (deleteHandler) {
            const deleteFileUrl = getFileRestUrl(tile._id);
            deleteFile(deleteFileUrl, deleteHandler);
        }
    };

    // descending order
    let copyVideoList = [...videoList];
    copyVideoList = copyVideoList.reverse();

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
                    { copyVideoList.length > 0 ? copyVideoList.map(tile => (
                        <GridListTile
                            key={tile._id}>
                            <ResponsiveVideoPlayer
                                tapPlay
                                controls
                                source={tile.url} />
                            <div className={classes.actionButtons}>
                                { selectHandler && <IconContainedButton
                                    secondary
                                    clicked={() => onSelectHandler(tile)}>
                                    Select
                                    <RightIconWrapper>
                                        <SelectIcon />
                                    </RightIconWrapper>
                                </IconContainedButton> }
                                { downloadHandler && <IconContainedButton
                                    secondary
                                    clicked={() => onDownloadHandler(tile)}>
                                    Download
                                    <RightIconWrapper>
                                        <DownloadIcon />
                                    </RightIconWrapper>
                                </IconContainedButton> }
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
                        </GridListTile>
                    )) : (
                        <Typography>No videos</Typography>
                    ) }
                </GridList>
            </div>
        </PaperLayer>
    );
}

VideoGrid.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles)(VideoGrid));
