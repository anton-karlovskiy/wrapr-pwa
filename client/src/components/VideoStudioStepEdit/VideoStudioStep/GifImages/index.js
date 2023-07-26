
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import ContainedButton from '../../../ContainedButton';
import DropzoneArea from '../../../DropzoneArea';
import CustomizedDialog from '../../../CustomizedDialog';
import ImageGrid from '../../../ImageGrid';
import { addGifImage, removeGifImage } from '../../../../actions/videoStepper';
import AlertDialog from '../../../AlertDialog';
import RemoveList from '../../../RemoveList';
import Loading from '../../../Loading';
import config from '../../../../config';
import { getUploadedUrl, fetchData } from '../../../../utils/api';
// TODO: replace temp with api
import { tempImageList, uploadType } from '../../../../utils/links';

class GifImages extends Component {
    state = {
        myUploadsModalOpen: false,
        // animation club
        acModalOpen: false,
        // graphics pack gifs
        gpgModalOpen: false,
        isMyUploadsLoading: false,
        myUploads: [],
        // TODO: implement animation club & graphics pack gifs scenario
        acAlertOpen: false,
        gpgAlertOpen: false
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
        const myUploadsUrl = getUploadedUrl(uploadType.gifImages);
        this.setState({isMyUploadsLoading: true});
        fetchData(myUploadsUrl, this.fetchMyUploadsCallback)
    };

    onMyUploadsClickHandler = () => {
        this.myUploadsModalOpenCloseHandler(true);
        this.fetchMyUploads();
    };

    myUploadsModalOpenCloseHandler = opened => {
        this.setState({myUploadsModalOpen: opened});
    };
    
    acModalOpenCloseHandler = opened => {
        this.setState({acModalOpen: opened});
    };

    gpgModalOpenCloseHandler = opened => {
        this.setState({gpgModalOpen: opened});
    };

    myUploadsSelectHandler = gifImage => {
        const { addGifImage, editPreviewSwitched } = this.props;
        addGifImage(gifImage);

        this.setState({myUploadsModalOpen: false});
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

    acSelectHandler = gifImage => {
        const { addGifImage, editPreviewSwitched } = this.props;
        console.log('ray : [acSelectHandler] gifImage => ', gifImage);
        addGifImage(gifImage);

        this.setState({acModalOpen: false});
        editPreviewSwitched();
    };

    gpgSelectHandler = gifImage => {
        const { addGifImage, editPreviewSwitched } = this.props;
        console.log('ray : [gpgSelectHandler] gifImage => ', gifImage);
        addGifImage(addGifImage);

        this.setState({gpgModalOpen: false});
        editPreviewSwitched();
    };

    acAlertOpenCloseHandler = opened => {
        this.setState({acAlertOpen: opened});
    };

    gpgAlertOpenCloseHandler = opened => {
        this.setState({gpgAlertOpen: opened});
    };

    render() {
        const {
            isMyUploadsLoading,
            myUploads,
            myUploadsModalOpen,
            acAlertOpen,
            acModalOpen,
            gpgAlertOpen,
            gpgModalOpen
        } = this.state;
        const { videoStepperGifImages, removeGifImage, editPreviewSwitched, addGifImage } = this.props;
        const removeGifImageList = videoStepperGifImages.map(gifImage => {
            return {
                title: gifImage.clientId,
                handler: () => removeGifImage(gifImage.clientId)
            };
        });
        const myUploadsContent = isMyUploadsLoading ? (
            <Loading />
        ) : (
            <ImageGrid
                imageList={myUploads}
                selectHandler={this.myUploadsSelectHandler}
                deleteHandler={this.myUploadsDeleteHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        const animationClubs =
            <ImageGrid
                imageList={tempImageList}
                selectHandler={this.acSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />;
        const graphicsPackGifs =
            <ImageGrid
                imageList={tempImageList}
                selectHandler={this.gpgSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />;
        return (
            <Fragment>
                <div>
                    <CustomizedDialog
                        opened={myUploadsModalOpen}
                        closed={() => this.myUploadsModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={myUploadsContent} />
                    {/* TODO: not sure about scenario */}
                    <AlertDialog
                        opened={acAlertOpen}
                        closed={() => this.acAlertOpenCloseHandler(false)}
                        title="No Access"
                        content={['You have no access to the Animations club Videos.']} />
                    <CustomizedDialog
                        opened={acModalOpen}
                        closed={() => this.acModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={animationClubs} />
                    {/* TODO: not sure about scenario */}
                    <AlertDialog
                        opened={gpgAlertOpen}
                        closed={() => this.gpgAlertOpenCloseHandler(false)}
                        title="No Access"
                        content={['You have no access to the Graphics Pack GIFs.']} />
                    <CustomizedDialog
                        opened={gpgModalOpen}
                        closed={() => this.gpgModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={graphicsPackGifs} />
                    <DropzoneArea
                        noticeCore="animation image"
                        subNoticeCore="image"
                        switchToPreview={editPreviewSwitched}
                        addElementToPreview={addGifImage}
                        acceptedFiles={config.acceptedUploadImageFiles}
                        maxFileSize={config.uploadImageMaxSize}
                        uploadWhat={uploadType.gifImages} />
                    <ContainedButton
                        secondary
                        clicked={this.onMyUploadsClickHandler}>
                        My Uploads
                    </ContainedButton>
                    <ContainedButton
                        secondary
                        // TODO: validation check
                        // clicked={() => this.acModalOpenCloseHandler(true)}
                        clicked={() => this.acAlertOpenCloseHandler(true)}>
                        Animation Club
                    </ContainedButton>
                    <ContainedButton
                        secondary
                        // TODO: validation check
                        // clicked={() => this.gpgModalOpenCloseHandler(true)}
                        clicked={() => this.gpgAlertOpenCloseHandler(true)}>
                        Graphics Pack GIFs
                    </ContainedButton>
                </div>
                <RemoveList list={removeGifImageList} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    videoStepperGifImages: state.videoStepper.gifImages
});
const mapActionToProps = {
    addGifImage,
    removeGifImage
};

export default connect(mapStateToProps, mapActionToProps)(GifImages);
