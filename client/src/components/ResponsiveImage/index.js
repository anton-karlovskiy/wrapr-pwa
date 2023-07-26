
import React from 'react';

const ResponsiveImage = ({ clientId, source }) => {
    const imageStyle = {
        width: '100%',
        height: '100%',
        backgroundImage: `url(${source})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    };
    return (
        <div style={imageStyle}></div>
    );
};

export default ResponsiveImage;
