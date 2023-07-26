
import React, { Component, Fragment } from 'react';

import VideoGrid from '../../components/VideoGrid';
import Loading from '../../components/Loading';
import { getUploadedUrl, fetchData, download } from '../../utils/api';
import { uploadType } from '../../utils/links';

class VideoGallery extends Component {
    state = {
        isCreatedVideosLoading: false,
        createdVideos: []
    };

    componentDidMount() {
        this._mounted = true;
        this.fetchCreatedVideos()
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    fetchCreatedVideosCallback = createdVideos => {
        if (this._mounted) {
            this.setState({isCreatedVideosLoading: false, createdVideos});
        }
    };

    fetchCreatedVideos = () => {
        const CreatedVideosUrl = getUploadedUrl(uploadType.createdVideo);
        this.setState({isCreatedVideosLoading: true});
        fetchData(CreatedVideosUrl, this.fetchCreatedVideosCallback);
    };

    createdVideosDownloadHandler = createdVideo => {
        const { url, fileName } = createdVideo;
        download(url, fileName);
    };

    createdVideosDeleteHandler = response => {
        const { success, fileId } = response;
        const { createdVideos } = this.state;
        if (success) {
            const newCreatedVideos = createdVideos.filter(item => item._id !== fileId);
            this.setState({createdVideos: newCreatedVideos});
        }
    };

    render () {
        const { isCreatedVideosLoading, createdVideos } = this.state;
        const createdVideosContent = isCreatedVideosLoading ? (
            <Loading />
        ) : (
            <VideoGrid
                videoList={createdVideos}
                downloadHandler={this.createdVideosDownloadHandler}
                deleteHandler={this.createdVideosDeleteHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        return (
            <Fragment>
                {createdVideosContent}
            </Fragment>
        );
    }
}

export default VideoGallery;
