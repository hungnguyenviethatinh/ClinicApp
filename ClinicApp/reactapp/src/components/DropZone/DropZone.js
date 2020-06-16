import React from 'react';
import DropZone from 'react-dropzone';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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
    const { fileType, onDropFile } = props;

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
                }
            });
        });
    };

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
