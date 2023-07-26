
import React from 'react';
import List from '@material-ui/core/List';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import Payment from '@material-ui/icons/Payment';
import Person from '@material-ui/icons/Person';
import Forward from '@material-ui/icons/Forward';
import Home from '@material-ui/icons/Home';

import NavigationItem from './NavigationItem';
import { pageLinks } from '../../../utils/links';
import { hasValidToken } from '../../../utils/utility';

const NavigationItems = ({ desktopBehavior }) => (
    <List className={desktopBehavior} component="nav">
        <NavigationItem onMobileBehavior={!desktopBehavior} link={pageLinks.WrapperList.url} icon={<Home />}>Home</NavigationItem>
        <NavigationItem onMobileBehavior={!desktopBehavior} link={pageLinks.VideoGallery.url} icon={<VideoLibrary />}>My Videos</NavigationItem>
        <NavigationItem onMobileBehavior={!desktopBehavior} link={pageLinks.Pricing.url} icon={<Payment />}>Pricing</NavigationItem>
        { hasValidToken() ? (
            <NavigationItem onMobileBehavior={!desktopBehavior} link={pageLinks.Logout.url} icon={<Forward />}>Logout</NavigationItem>
        ) : (
            <NavigationItem onMobileBehavior={!desktopBehavior} link={pageLinks.Login.url} icon={<Person />}>Login</NavigationItem>
        ) }
    </List>
);

export default NavigationItems;
