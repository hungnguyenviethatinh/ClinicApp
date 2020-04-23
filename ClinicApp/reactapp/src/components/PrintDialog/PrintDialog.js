import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { Button } from '../Button';

const useStyles = makeStyles({
    paper: {
        padding: '0px 24px',
    },
    title: {
        padding: '16px 8px',
    },
    content: {
        padding: '8px',
    },
    action: {
        justifyContent: 'center',
    },
});

const PrintDialog = (props) => {
    const { open, handleClose, handlePrint } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="action-options"
                classes={{
                    paper: classes.paper,
                }}
            >
                <DialogTitle
                    id="action-options"
                    classes={{
                        root: classes.title,
                    }}>Xác nhận in</DialogTitle>
                <DialogContent classes={{
                    root: classes.content,
                }}>
                    <DialogContentText>
                        Bạn muốn in phiếu chỉ định này chứ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions classes={{
                    root: classes.action,
                }}>
                    <Grid container spacing={2} justify="center">
                        <Grid item sm={6}>
                            <Button
                                fullWidth
                                color="danger"
                                children="Hủy"
                                iconName="cancel"
                                onClick={handleClose}
                                style={{ marginRight: 16 }}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <Button
                                fullWidth
                                color="warning"
                                children="In"
                                iconName="print"
                                onClick={handlePrint}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>
    );
};

PrintDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handlePrint: PropTypes.func,
};

PrintDialog.defaultProps = {
    open: false,
    handleClose: () => { },
    handlePrint: () => { },
};

export default PrintDialog;
