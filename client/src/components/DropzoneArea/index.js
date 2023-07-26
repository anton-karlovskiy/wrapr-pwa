
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import axios from 'axios';

// TODO: block for now according to client's requirements
// import ContainedButton from '../ContainedButton';
import config from '../../config';
import { getUploadUrl, apiUnauthorizedHandler } from '../../utils/api';
import { uploadAccessType } from '../../utils/links';
import { screenSize, measureScreenSize } from '../../utils/utility';

// TODO: could convert this component to material ui based & check codes & optimize markups & optimize behavior to production level
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 4px',
    marginBottom: '12px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const DropzoneArea = props => {
    const [files, setFiles] = useState([]);
    const [loaded, setLoaded] = useState(0);
    const [uploading, setUploading] = useState(false);

    const onUploadHandler = files => {
        if (files.length === 0) {
            console.log('ray : [components DropzoneArea onUploadHandler] files => ', files);
            return;
        }

        const data = new FormData();
        for (const file of files) {
            data.append('file', file);
        }

        // TODO: admin to upload to public
        let uploadUrl;
        if (config.publicUploadDev) {
            uploadUrl = getUploadUrl(props.uploadWhat, uploadAccessType.public);
        } else {
            uploadUrl = getUploadUrl(props.uploadWhat);
        }
        setUploading(true);
        axios.post(uploadUrl, data, {
            onUploadProgress: ProgressEvent => {
                setLoaded(Math.max(loaded, (ProgressEvent.loaded / ProgressEvent.total * 100)));
                console.log('ray : [Video step onUploadHandler] % => ', ProgressEvent.loaded / ProgressEvent.total * 100);
            }
        })
        .then(response => {
            const { switchToPreview, addElementToPreview } = props;
            if (switchToPreview){
                const { data: uploadedFiles } = response;
                addElementToPreview(uploadedFiles[0]);
                switchToPreview();
            } else {
                toast.info('Uploading Completed!', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                setFiles([]);
                setUploading(false);
            }
        })
        .catch(error => {
            setUploading(false);
            // TODO: api error handling -> axios utility could be used
            // it's working well
            if (error.response) {
                apiUnauthorizedHandler(error.response.status);
            }
            console.log('ray : [components DropzoneArea] error => ', error);
            toast.error('Uploading Failed!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        });
    };

    const onChangeHandler = useCallback(acceptedFiles => {
        if (!uploading) {
            setFiles(acceptedFiles);
            onUploadHandler(acceptedFiles);
        }
    }, []);

    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: props.acceptedFiles,
        maxSize: props.maxFileSize,
        onDrop: onChangeHandler,
        multiple: false,
        disabled: uploading
    });
        
    const acceptedFilesItems = acceptedFiles.map(file => (
        <li key={file.path}>
            ({file.path} - {Math.round(file.size / 1024 / 1024)} MBytes)
        </li>
    ));
  
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    const onDesktop = screenSize.desktop === measureScreenSize('md', isWidthUp, props.width);
    let notice;
    let subNotice;
    if (onDesktop) {
        notice = `Drag ${props.noticeCore} files here, or click to select files to upload.`;
        subNotice = `(Only ${props.subNoticeCore} format files will be accepted)`;
    } else {
        notice = `Click to select ${props.noticeCore} files to upload.`;
        subNotice = '';
    }

    return (
        <section style={{padding: '4px'}}>
            <ToastContainer />
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <Typography variant="caption" align="center">{notice}</Typography>
                <Typography variant="caption" align="center">{subNotice}</Typography>
                {/* TODO: block for now according to client's requirements */}
                {/* { files.length > 0 && (
                    <ContainedButton
                        secondary
                        disablePropagation
                        disabled={uploading}
                        clicked={() => onUploadHandler(files)}>
                        Upload
                    </ContainedButton>
                ) } */}
            </div>
            <div>
                <LinearProgress
                    variant="determinate" 
                    value={loaded} />
                <Typography variant="button">Files for Upload</Typography>
                <ul>
                    {files.length > 0 && acceptedFilesItems}
                </ul>
            </div>
        </section>
    );
};

DropzoneArea.propTypes = {
    uploadWhat: PropTypes.string.isRequired
};

export default withWidth()(DropzoneArea);
