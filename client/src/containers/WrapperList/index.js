
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import ImageGrid from '../../components/ImageGrid';
import stepOne from '../../assets/images/wrapper-list/step-one.png';
import { pageLinks, wrapperIdParamName, wrapperList } from '../../utils/links';

class WrapperList extends Component {
    wrapperClickHandler = tile => {
        const { history } = this.props;
        history.push({
            pathname: pageLinks.VideoStudio.url,
            search: `?${wrapperIdParamName}=${tile._id}`
        });
    };

    render () {
        // TODO: alt strategy unclear
        const imageGridTitle = <img height="64" src={stepOne} alt="choose your wrap" />;
        return (
            <Fragment>
                <ImageGrid
                    title={imageGridTitle}
                    imageList={wrapperList}
                    selectHandler={this.wrapperClickHandler}
                    gridCellHeight="auto"
                    gridListSizeOverride={{width: '100%', height: '100%'}} />
            </Fragment>
        );
    }
}

export default withRouter(WrapperList);
