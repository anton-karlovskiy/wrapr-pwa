
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import ContainedButton from '../../../ContainedButton';
import DropzoneArea from '../../../DropzoneArea';
import CustomizedDialog from '../../../CustomizedDialog';
import ImageGrid from '../../../ImageGrid';
import { addHeaderFooter, removeHeaderFooter } from '../../../../actions/videoStepper';
import AlertDialog from '../../../AlertDialog';
import RemoveList from '../../../RemoveList';
import Loading from '../../../Loading';
import config from '../../../../config';
import { getUploadedUrl, fetchData } from '../../../../utils/api';
import { uploadType, uploadAccessType } from '../../../../utils/links';

class HeaderFooters extends Component {
    state = {
        myUploadsModalOpen: false,
        stockImagesModalOpen: false,
        isMyUploadsLoading: false,
        myUploads: [],
        isStockImagesLoading: false,
        stockImages: [],
        stockImagesAlertOpen: false
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
        const myUploadsUrl = getUploadedUrl(uploadType.headerFooters);
        this.setState({isMyUploadsLoading: true});
        fetchData(myUploadsUrl, this.fetchMyUploadsCallback)
    };

    fetchSIsCallback = stockImages => {
        if (this._mounted) {
            this.setState({isStockImagesLoading: false, stockImages});
        }
    };

    fetchStockImages = () => {
        const stockImagesUrl = getUploadedUrl(uploadType.headerFooters, uploadAccessType.public);
        this.setState({isStockImagesLoading: true});
        fetchData(stockImagesUrl, this.fetchSIsCallback);
    };

    onMyUploadsClickHandler = () => {
        this.myUploadsModalOpenCloseHandler(true);
        this.fetchMyUploads();
    };

    onSIsClickHandler = () => {
        this.stockImagesModalOpenCloseHandler(true);
        this.fetchStockImages();
    };
    
    myUploadsModalOpenCloseHandler = opened => {
        this.setState({myUploadsModalOpen: opened});
    };
    
    stockImagesModalOpenCloseHandler = opened => {
        this.setState({stockImagesModalOpen: opened});
    };

    myUploadsSelectHandler = headerFooter => {
        const { addHeaderFooter, editPreviewSwitched } = this.props;
        const isHeaderFooterSet = addHeaderFooter(headerFooter);
        
        this.setState({myUploadsModalOpen: false, stockImagesAlertOpen: !isHeaderFooterSet});
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

    stockImagesSelectHandler = headerFooter => {
        const { addHeaderFooter, editPreviewSwitched } = this.props;
        addHeaderFooter(headerFooter);

        this.setState({stockImagesModalOpen: false});
        editPreviewSwitched();
    };

    alertClosehandler = () => {
        this.setState({stockImagesAlertOpen: false});
    };

    render() {
        const {
            myUploadsModalOpen,
            stockImagesModalOpen,
            isMyUploadsLoading,
            isStockImagesLoading,
            myUploads,
            stockImages
        } = this.state;
        const { videoStepperHeaderFooters, removeHeaderFooter, editPreviewSwitched, addHeaderFooter } = this.props;

        const removeHeaderFooterList = videoStepperHeaderFooters.map(headerFooter => {
            return {
                title: headerFooter.clientId,
                handler: () => removeHeaderFooter(headerFooter.clientId)
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
        const stockImagesContent = isStockImagesLoading ? (
            <Loading />
        ) : (
            <ImageGrid
                imageList={stockImages}
                selectHandler={this.stockImagesSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        return (
            <Fragment>
                <div>
                    <AlertDialog
                        opened={this.state.stockImagesAlertOpen}
                        closed={this.alertClosehandler}
                        content={['Header and Footer images are full.']} />
                    <CustomizedDialog
                        opened={myUploadsModalOpen}
                        closed={() => this.myUploadsModalOpenCloseHandler(false)}
                        title="Select Header & Footer"
                        content={myUploadsContent} />
                    <CustomizedDialog
                        opened={stockImagesModalOpen}
                        closed={() => this.stockImagesModalOpenCloseHandler(false)}
                        title="Select Header & Footer"
                        content={stockImagesContent} />
                    <DropzoneArea
                        noticeCore="header & footer image"
                        subNoticeCore="image"
                        switchToPreview={editPreviewSwitched}
                        addElementToPreview={addHeaderFooter}
                        acceptedFiles={config.acceptedUploadImageFiles}
                        maxFileSize={config.uploadImageMaxSize}
                        uploadWhat={uploadType.headerFooters} />
                    <ContainedButton
                        secondary
                        clicked={this.onMyUploadsClickHandler}>
                        My Uploads
                    </ContainedButton>
                    <ContainedButton
                        secondary
                        clicked={this.onSIsClickHandler}>
                        Stock Images
                    </ContainedButton>
                </div>
                <RemoveList list={removeHeaderFooterList} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    videoStepperHeaderFooters: state.videoStepper.headerFooters
});
const mapActionToProps = {
    addHeaderFooter,
    removeHeaderFooter
};

export default connect(mapStateToProps, mapActionToProps)(HeaderFooters);
