import React from 'react';
import DropZone from 'react-dropzone';
// import { IconButton, Grid, Typography, Paper } from '@material-ui/core';
// import { red } from '@material-ui/core/colors';
// import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import _ from 'lodash';

import { encodeFileToBase64 } from '../../common';

const styles = {
    thumbContainer: {
        width: '100%',
        margin: 0,
    },

    thumb: {
        border: '1px solid rgba(63,63,68,0.05)',
    },

    img: {
        width: '100%',
        height: 150,
        objectFit: 'contain',
    },

    clearButton: {
        padding: 0,
    },
};

const DropZoneComponent = props => {
    // const { classes, fileType, onDropFile } = props;
    const { fileType, onDropFile } = props;

    // const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const onDrop = (acceptedFiles) => {
        const files = [];
        acceptedFiles.map((file, index) => {
            encodeFileToBase64(file).then((result) => {
                files.push({
                    name: file.name,
                    lastModifiedDate: file.lastModifiedDate,
                    data: result,
                });
                if (index === acceptedFiles.length - 1) {
                    onDropFile(files);
                    // setUploadedFiles([...files]);
                }
            });
        });
    };

    // const clearAcceptedFiles = (file) => {
    //     const restOfFiles = _.remove(uploadedFiles, (f) => f.name !== file.name);

    //     onDropFile(restOfFiles);
    //     setUploadedFiles([...restOfFiles]);
    // };

    // const thumbs = (files) => {
    //     return (
    //         <Paper elevation={0}>
    //             <Typography
    //                 style={{ marginBottom: 16 }}
    //                 component="p"
    //                 variant="caption"
    //                 children="Hình ảnh đã tải lên"
    //             />
    //             <Grid
    //                 className={classes.thumbContainer}
    //                 container
    //                 spacing={2}
    //             >
    //                 {files.map((file, index) => (
    //                     <Grid
    //                         className={classes.thumb}
    //                         key={index}
    //                         item
    //                         xs={12} sm={12} md={4} lg={4} xl={4}
    //                     >
    //                         <div style={{ textAlign: 'right' }}>
    //                             <IconButton
    //                                 className={classes.clearButton}
    //                                 onClick={() => clearAcceptedFiles(file)}
    //                             >
    //                                 <Close style={{ color: red[800] }} />
    //                             </IconButton>
    //                         </div>
    //                         <img
    //                             className={classes.img}
    //                             src={file.data}
    //                         />
    //                     </Grid>
    //                 ))}
    //             </Grid>
    //         </Paper>
    //     );
    // };

    return (
        <DropZone
            multiple
            onDrop={onDrop}
            accept={fileType}
        >
            {({ getRootProps, getInputProps }) => (
                <section className="container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Kéo và thả ảnh vào đây, hoặc click để chọn ảnh</p>
                    </div>
                    {/* {uploadedFiles.length > 0 && thumbs(uploadedFiles)} */}
                </section>
            )}
        </DropZone>
    );
};

DropZoneComponent.propTypes = {
    classes: PropTypes.object,
    fileType: PropTypes.string,
    onDropFile: PropTypes.func,
};

DropZoneComponent.defaultProps = {
    classes: null,
    fileType: 'image/*',
    onDropFile: () => { },
};

export default withStyles(styles)(DropZoneComponent);
