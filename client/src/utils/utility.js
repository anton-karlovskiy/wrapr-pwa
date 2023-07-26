
import ReactDOM from "react-dom";
import jwt_decode from 'jwt-decode';

import { jwtTokenKey } from './links';

const breakpoints = new Set(['xl', 'lg', 'md', 'sm', 'xs']);

const checkBreakpointValidation = breakpoint => {
    if (!breakpoints.has(breakpoint)) {
        throw new Error('Breakpoint is invalid.');
    }
};

const screenSize = {
    desktop: 'desktop',
    mobile: 'mobile'
};

const sizeDimensionName = {
    width: 'Width',
    height: 'Height'
};

const flexDirection = {
    horizontal: 'row',
    vertical: 'column'
};

const measureScreenSize = (breakpoint, isWidthUp, width) => {
    checkBreakpointValidation(breakpoint);

    if (isWidthUp(breakpoint, width)) {
      return screenSize.desktop;
    }

    return screenSize.mobile;
};

const setMobileFullWidth = (breakpoint, theme, previousStyle, desktopSpecific) => {
    checkBreakpointValidation(breakpoint);
    const newStyle = {
        ...previousStyle,
        width: '100%',
        [theme.breakpoints.up(breakpoint)]: {
            width: 'auto',
            ...desktopSpecific
        }
    };

    return newStyle;
};

const setResponsiveStyle = (breakpoint, theme, previousStyle, desktopSpecific) => {
    checkBreakpointValidation(breakpoint);
    const newStyle = {
        ...previousStyle,
        [theme.breakpoints.up(breakpoint)]: {
            ...desktopSpecific
        }
    };

    return newStyle;
};

const setMobileFlexSwitch = (breakpoint, theme, previousStyle, desktopSpecific) => {
    checkBreakpointValidation(breakpoint);
    const newStyle = {
        ...previousStyle,
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up(breakpoint)]: {
            flexDirection: 'row',
            ...desktopSpecific
        }
    };

    return newStyle;
};

const getSpacingUnit = theme => (theme.spacing(1));

const getPhysicalSize = (logicalSize, scale) => {
    let { width: physicalWidth, height: physicalHeight } = logicalSize;
    if (scale) {
        physicalWidth = physicalWidth / scale;
        physicalHeight = physicalHeight / scale;
    }
    const physicalSize = {
        width: parseInt(physicalWidth, 10),
        height: parseInt(physicalHeight, 10)
    };
    return physicalSize;
};

const getPhysicalPos = (logicalPos, scale) => {
    let { x: physicalX, y: physicalY } = logicalPos;
    if (scale) {
        physicalX = physicalX / scale;
        physicalY = physicalY / scale;
    }
    const physicalPos = {
        x: parseInt(physicalX, 10),
        y: parseInt(physicalY, 10)
    };
    return physicalPos;
};

const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
};

const measureElement = element => {
    const DOMNode = ReactDOM.findDOMNode(element);
    const width = DOMNode.offsetWidth;
    const height = DOMNode.offsetHeight;
    const measuredSize = {
        width,
        height
    };
    return measuredSize;
};

const convertDurationString = seconds => {
    const initialDuration = '00:00:00';
    if (!seconds) {
        return initialDuration;
    }

    const pad = str => {
        return ('0' + str).slice(-2);
    };
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    let duration;
    if (hh) {
        duration = `${hh}:${pad(mm)}:${ss}`;
    }
    duration = `00:${pad(mm)}:${ss}`;
    return duration;
}

const hasValidToken = () => {
    if (!localStorage.getItem(jwtTokenKey)) {
        return false;
    }

    const decoded = jwt_decode(localStorage.getItem(jwtTokenKey));    
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        return false;
    }

    return true;
};

const elementSizePosSet = element => {
    const { width, height, x, y } = element;
    if (width >=0 && height >= 0 && x >= 0 && y >= 0) {
        return true;
    } else {
        return false;
    }
};

export {
    screenSize,
    measureScreenSize,
    setMobileFullWidth,
    setMobileFlexSwitch,
    sizeDimensionName,
    getSpacingUnit,
    flexDirection,
    setResponsiveStyle,
    isEmpty,
    getPhysicalSize,
    getPhysicalPos,
    measureElement,
    convertDurationString,
    hasValidToken,
    elementSizePosSet
};
