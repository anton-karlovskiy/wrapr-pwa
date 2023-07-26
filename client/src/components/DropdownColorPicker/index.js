
import React, { Component, Fragment } from 'react';
import { CompactPicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        cover: {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        popover: {
            position: 'absolute',
            zIndex: '2'
        },
        swatch: {
            marginTop: spacingUnit,
            marginBottom: spacingUnit / 2,
            padding: spacingUnit,
            background: '#fff',
            borderRadius: spacingUnit / 2,
            boxShadow: '0 0 0 1px rgba(0, 0, 0, .1)',
            display: 'inline-block',
            cursor: 'pointer'
        },
        colorBar: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            // TODO: 49px tuning
            height: spacingUnit * 4 + 1,
            borderRadius: spacingUnit / 2
        }
    };
};

class DropdownColorPicker extends Component {
    state = {
        displayColorPicker: false
    };

    clickHandler = () => {
        this.setState(prevState => {
            return { displayColorPicker: !prevState.displayColorPicker };
        });
    };

    closeHandler = () => {
        this.setState({displayColorPicker: false});
    };

    render() {
        const { classes, pickedColor, colorChanged, caption } = this.props;
        const styles = {
            color: {
                background: pickedColor
            }
        };

        return (
            <Fragment>
                <div className={classes.swatch} onClick={this.clickHandler}>
                    <div className={classes.colorBar} style={styles.color}>
                        <Typography variant="subtitle1">
                            {caption}
                        </Typography>
                    </div>
                </div>
                { this.state.displayColorPicker && (
                    <div className={classes.popover}>
                        <div className={classes.cover} onClick={this.closeHandler} />
                        <CompactPicker color={pickedColor} onChange={colorChanged} />
                    </div> 
                ) }
            </Fragment>
        )
    }
}

export default withStyles(styles)(DropdownColorPicker);;
