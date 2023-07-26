
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';

import ContainedButton from '../../../ContainedButton';
import AlertDialog from '../../../AlertDialog';
import DropzoneArea from '../../../DropzoneArea';
import CustomizedDialog from '../../../CustomizedDialog';
import VideoGrid from '../../../VideoGrid';
import { setVideo } from '../../../../actions/videoStepper';
import IconContainedButton from '../../../IconContainedButton';
import RightIconWrapper from '../../../../hoc/RightIconWrapper';
import Loading from '../../../Loading';
import config from '../../../../config';
import { getUploadedUrl, fetchData } from '../../../../utils/api';
import { uploadType, uploadAccessType } from '../../../../utils/links';

class Video extends Component {
    state = {
        myUploadsModalOpen: false,
        // animation club
        acModalOpen: false,
        acAlertOpen: false,
        isMyUploadsLoading: false,
        myUploads: [],
        isACLoading: false,
        animationClub: []
    };

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    fetchMyUploadsCallback = myUploads => {
        if (this._mounted) {
            this.setState({isMyUploadsLoading: false, myUploads});
        }
    };

    fetchMyUploads = () => {
        const myUploadsUrl = getUploadedUrl(uploadType.video);
        this.setState({isMyUploadsLoading: true});
        fetchData(myUploadsUrl, this.fetchMyUploadsCallback);
    };

    fetchACCallback = animationClub => {
        if (this._mounted) {
            this.setState({isACLoading: false, animationClub});
        }
    };

    fetchAC = () => {
        const animationClubUrl = getUploadedUrl(uploadType.video, uploadAccessType.public);
        this.setState({isACLoading: true});
        fetchData(animationClubUrl, this.fetchACCallback);
    };

    onMyUploadsClickHandler = () => {
        this.myUploadsModalOpenCloseHandler(true);
        this.fetchMyUploads();
    };

    onACClickHandler = () => {
        this.acModalOpenCloseHandler(true);
        this.fetchAC();
    };
    
    myUploadsModalOpenCloseHandler = opened => {
        this.setState({myUploadsModalOpen: opened});                
    };

    acModalOpenCloseHandler = opened => {
        this.setState({acModalOpen: opened});
    };

    videoSelect = video => {
        const { setVideo } = this.props;
        setVideo(video);
    };

    myUploadsSelectHandler = video => {
        this.videoSelect(video);        
        this.setState({myUploadsModalOpen: false});
        const { editPreviewSwitched } = this.props;
        editPreviewSwitched();
    };

    myUploadsDeleteHandler = response => {
        const { success, fileId } = response;
        const { myUploads } = this.state;
        if (success) {
            const newMyUploads = myUploads.filter(item => item._id !== fileId);
            this.setState({myUploads: newMyUploads});
        }
    };

    acSelectHandler = video => {
        this.videoSelect(video);
        this.setState({acModalOpen: false});
        const { editPreviewSwitched } = this.props;
        editPreviewSwitched();
    };

    acAlertOpenCloseHandler = opened => {
        this.setState({acAlertOpen: opened});
    };

    removeVideo = () => {
        const { setVideo } = this.props;
        setVideo(null);
    };

    render() {
        const { isMyUploadsLoading, myUploads, isACLoading, animationClub } = this.state;
        const { videoStepperVideo, editPreviewSwitched, setVideo } = this.props;
        const myUploadsContent = isMyUploadsLoading ? (
            <Loading />
        ) : (
            <VideoGrid
                videoList={myUploads}
                selectHandler={this.myUploadsSelectHandler}
                deleteHandler={this.myUploadsDeleteHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        const animationClubContent = isACLoading ? (
            <Loading />
        ) : (
            <VideoGrid
                videoList={animationClub}
                selectHandler={this.acSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        return (
            <div>
                <CustomizedDialog
                    opened={this.state.myUploadsModalOpen}
                    closed={() => this.myUploadsModalOpenCloseHandler(false)}
                    title="Select Video"
                    content={myUploadsContent} />
                {/* TODO: not sure about scenario */}
                <AlertDialog
                    opened={this.state.acAlertOpen}
                    closed={() => this.acAlertOpenCloseHandler(false)}
                    title="No Access"
                    content={['You have no access to the Animations club Videos.']} />
                <CustomizedDialog
                    opened={this.state.acModalOpen}
                    closed={() => this.acModalOpenCloseHandler(false)}
                    title="Select Video"
                    content={animationClubContent} />
                <DropzoneArea
                    noticeCore="video"
                    subNoticeCore="video"
                    switchToPreview={editPreviewSwitched}
                    addElementToPreview={setVideo}
                    acceptedFiles={config.acceptedUploadVideoFiles}
                    maxFileSize={config.uploadVideoMaxSize}
                    uploadWhat={uploadType.video} />
                <ContainedButton
                    secondary
                    clicked={this.onMyUploadsClickHandler}>
                    My Uploads
                </ContainedButton>
                <ContainedButton
                    secondary
                    // TODO: validation check based on business scenario
                    clicked={config.publicUploadDev ? this.onACClickHandler : () => this.acAlertOpenCloseHandler(true)}>
                    Animation Club
                </ContainedButton>
                { videoStepperVideo && (
                    <IconContainedButton
                        error
                        clicked={this.removeVideo}>
                        Remove
                        <RightIconWrapper>
                            <DeleteIcon />
                        </RightIconWrapper>
                    </IconContainedButton>
                ) }
            </div>
        );
    }
}

// TODO: validation check is hardcoded, we need to check every routing, not just this page
const mapStateToProps = state => ({
    videoStepperVideo: state.videoStepper.video
});

const mapActionToProps = {
    setVideo
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(Video));
