import React from 'react';
import DropZone from 'react-dropzone';
import { IconButton, Grid, Typography, Paper } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const styles = {
    thumbContainer: {
        width: '100%',
        margin: 0,
    },
    thumb: {
        border: '1px solid silver',
    },
    img: {
        width: '100%',
        height: 100,
        objectFit: 'contain',
    },
    clearButton: {
        padding: 0,
    },
};

const DropZoneComponent = props => {
    const { classes, onDropFile } = props;

    const [files, setFiles] = React.useState([]);
    const onDrop = React.useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.info('[DropZone]: File reading was aborted');
            reader.onerror = () => console.error('[DropZone]: File reading has failed');
            reader.onload = () => {
                Object.assign(file, { base64Encode: reader.result });
            };
            reader.readAsDataURL(file);
        });

        onDropFile(acceptedFiles);
        setFiles(acceptedFiles);
    }, []);

    const clearAcceptedFiles = (file) => {
        const rest = _.remove(files, (f) => f.name !== file.name);

        onDropFile(rest);
        setFiles(rest);
    };

    const thumbs = (files) => {
        return (
            <Paper elevation={0}>
                <Typography style={{ marginBottom: 16 }} component="h4" variant="h4" children="Hình ảnh" />
                <Grid className={classes.thumbContainer} container spacing={2}>
                    {files.map((file) => (
                        <Grid
                            className={classes.thumb}
                            key={file.name}
                            item
                            xs={12} sm={12} md={3} lg={3} xl={3}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <IconButton
                                    className={classes.clearButton}
                                    onClick={() => clearAcceptedFiles(file)}
                                >
                                    <Close style={{ color: 'red' }} />
                                </IconButton>
                            </div>
                            <img
                                src={file.base64Encode}
                                className={classes.img}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        );
    };

    return (
        <DropZone
            multiple
            onDrop={onDrop}
            accept="image/*"
        >
            {({ getRootProps, getInputProps }) => (
                <section className="container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Kéo và thả ảnh vào đây, hoặc click để chọn ảnh</p>
                    </div>
                    {files.length > 0 && thumbs(files)}
                </section>
            )}
        </DropZone>
    );
};

DropZoneComponent.propTypes = {
    classes: PropTypes.object,
    onDropFile: PropTypes.func,
};

DropZoneComponent.defaultProps = {
    classes: null,
    onDropFile: () => { },
};

export default withStyles(styles)(DropZoneComponent);
