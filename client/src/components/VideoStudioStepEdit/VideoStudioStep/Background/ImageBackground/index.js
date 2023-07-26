
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';

import { setBackgroundImage } from '../../../../../actions/videoStepper';
import ContainedButton from '../../../../ContainedButton';
import DropzoneArea from '../../../../DropzoneArea';
import CustomizedDialog from '../../../../CustomizedDialog';
import ImageGrid from '../../../../ImageGrid';
import IconContainedButton from '../../../../IconContainedButton';
import RightIconWrapper from '../../../../../hoc/RightIconWrapper';
import Loading from '../../../../Loading';
import config from '../../../../../config';
import { getUploadedUrl, fetchData } from '../../../../../utils/api';
import { uploadType, uploadAccessType } from '../../../../../utils/links';

class ImageBackground extends Component {
    state = {
        myUploadsModalOpen: false,
        // graphics pack backgrounds
        gpbsModalOpen: false,
        isMyUploadsLoading: false,
        myUploads: [],
        isGPBsLoading: false,
        gpbs: []
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
        const myUploadsUrl = getUploadedUrl(uploadType.backgroundImage);
        this.setState({isMyUploadsLoading: true});
        fetchData(myUploadsUrl, this.fetchMyUploadsCallback);
    };

    fetchGPBsCallback = gpbs => {
        if (this._mounted) {
            this.setState({isGPBsLoading: false, gpbs});
        }
    };

    fetchGPBs = () => {
        const gpbsUrl = getUploadedUrl(uploadType.backgroundImage, uploadAccessType.public);
        this.setState({isGPBsLoading: true});
        fetchData(gpbsUrl, this.fetchGPBsCallback);
    };

    onMyUploadsClickHandler = () => {
        this.myUploadsModalOpenCloseHandler(true);
        this.fetchMyUploads();
    };

    onGPBsClickHandler = () => {
        this.gpbsModalOpenCloseHandler(true);
        this.fetchGPBs();
    };

    myUploadsModalOpenCloseHandler = opened => {
        this.setState({myUploadsModalOpen: opened});
    };
    
    gpbsModalOpenCloseHandler = opened => {
        this.setState({gpbsModalOpen: opened});
    };

    backgroundImageSelect = backgroundImage => {
        const { setBackgroundImage } = this.props;
        setBackgroundImage(backgroundImage);
    };
    
    myUploadsSelectHandler = backgroundImage => {
        const { editPreviewSwitched } = this.props;
        editPreviewSwitched();
        this.backgroundImageSelect(backgroundImage);
        this.setState({myUploadsModalOpen: false});
    };

    myUploadsDeleteHandler = response => {
        const { success, fileId } = response;
        const { myUploads } = this.state;
        if (success) {
            const newMyUploads = myUploads.filter(item => item._id !== fileId);
            this.setState({myUploads: newMyUploads});
        }
    };
    
    gpbsSelectHandler = backgroundImage => {
        const { editPreviewSwitched } = this.props;
        editPreviewSwitched();
        this.backgroundImageSelect(backgroundImage);
        this.setState({gpbsModalOpen: false});
    };

    removeBackgroundImage = () => {
        const { setBackgroundImage } = this.props;
        setBackgroundImage(null);
    };

    render() {
        const {
            myUploadsModalOpen,
            gpbsModalOpen,
            isMyUploadsLoading,
            isGPBsLoading,
            myUploads,
            gpbs
        } = this.state;
        const { videoStepperBackgroundImage, editPreviewSwitched, setBackgroundImage } = this.props;
        const myUploadsContent = isMyUploadsLoading ? (
            <Loading />
        ) : (
            <ImageGrid
                imageList={myUploads}
                selectHandler={this.myUploadsSelectHandler}
                deleteHandler={this.myUploadsDeleteHandler}
                gridCellHeight="auto" // specific image height parameter
                // grid list width & height
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        
        const gpbsContent = isGPBsLoading ? (
            <Loading />
        ) : (
            <ImageGrid
                imageList={gpbs}
                selectHandler={this.gpbsSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        return (
            <div>
                <CustomizedDialog
                    opened={myUploadsModalOpen}
                    closed={() => this.myUploadsModalOpenCloseHandler(false)}
                    title="Select Background"
                    content={myUploadsContent} />
                <CustomizedDialog
                    opened={gpbsModalOpen}
                    closed={() => this.gpbsModalOpenCloseHandler(false)}
                    title="Select Background"
                    content={gpbsContent} />
                <DropzoneArea
                    noticeCore="background image"
                    subNoticeCore="image"
                    switchToPreview={editPreviewSwitched}
                    addElementToPreview={setBackgroundImage}
                    acceptedFiles={config.acceptedUploadImageFiles}
                    maxFileSize={config.uploadImageMaxSize}
                    uploadWhat={uploadType.backgroundImage} />
                <ContainedButton
                    secondary
                    clicked={this.onMyUploadsClickHandler}>
                    My Uploads
                </ContainedButton>
                <ContainedButton
                    secondary
                    clicked={this.onGPBsClickHandler}>
                    Graphics Pack Backgrounds
                </ContainedButton>
                { videoStepperBackgroundImage && (
                    <IconContainedButton
                        error
                        clicked={this.removeBackgroundImage}>
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

const mapStateToProps = state => ({
    videoStepperBackgroundImage: state.videoStepper.backgroundImage
});
const mapActionToProps = {
    setBackgroundImage
};

export default connect(mapStateToProps, mapActionToProps)(ImageBackground);
