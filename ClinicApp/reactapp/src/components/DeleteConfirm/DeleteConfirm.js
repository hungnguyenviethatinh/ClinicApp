import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Button } from '../Button';

const DeleteConfirmDialog = (props) => {
    const { open, handleClose, handleDelete } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        color="danger"
                        children="Hủy"
                        iconName="cancel"
                        onClick={handleClose}
                        style={{ marginRight: 16 }}
                    />
                    <Button
                        color="success"
                        children="Xác nhận"
                        iconName="done"
                        onClick={handleDelete}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};

DeleteConfirmDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleDelete: PropTypes.func,
};

DeleteConfirmDialog.defaultProps = {
    open: false,
    handleClose: () => { },
    handleDelete: () => { },
};

export default DeleteConfirmDialog;
