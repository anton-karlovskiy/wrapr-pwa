
import React from 'react';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import yellow from '@material-ui/core/colors/yellow';

import config from '../../../config';
import { setMobileFlexSwitch } from '../../../utils/utility';

const styles = theme => {
    let root = {
        backgroundColor: yellow['A200'],
        alignItems: 'center',
        fontSize: '.9rem',
    };
    const desktopSpecific = { fontSize: '1rem' };
    root = setMobileFlexSwitch('sm', theme, root, desktopSpecific);

    return { root };
};

const BottomBanner = ({ classes }) => {
    return (
        <Typography variant="subtitle1" gutterBottom>
            <Box justifyContent="center" fontWeight={600} className={classes.root}>
                <Link href={config.newAnimatedBannerUrl} color="secondary" target="_blank" rel="noopener">
                    Get NEW Animated Banners By Click Here...
                </Link>
            </Box>
        </Typography>
    );
};

export default withStyles(styles)(BottomBanner);