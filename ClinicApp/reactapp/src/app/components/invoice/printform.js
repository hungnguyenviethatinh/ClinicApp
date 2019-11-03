import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

import FullScreenDialog from '../_shared/dialog';
import Snackbar from '../_shared/snackbar';

import { ChromelyService } from '../../services';

const useStyles = makeStyles(theme => ({
    head: {
        marginBottom: theme.spacing(3),
    },

    paper: {
        padding: theme.spacing(3)
    },
}));

const PrintForm = props => {
    const classes = useStyles();
    const { open, handleClose, value } = props;

    const buttons = [
        {
            children: 'In',
            iconName: 'print',
            onClick: () => { handlePrint() }
        }
    ];

    const handlePrint = () => {
        const data = { ...value }
        delete data.tableData;
        console.log(JSON.stringify(data));
        ChromelyService.Post('/democontroller/print', null, data, response => {
            const jsonData = JSON.parse(response.ResponseText);
            if (jsonData.ReadyState == 4 && jsonData.Status == 200) {
                handleSnackbarOption('success', 'Toa thuốc đã được lưu trong file invoices/test.pdf!');
                setOpenSnackbar(true);
            } else {
                handleSnackbarOption('error', 'Có lỗi xảy ra!');
                setOpenSnackbar(true);
            }
        });
    };

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const [snackbarOption, setSnackbarOption] = React.useState({
        variant: 'success',
        message: '',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
    };

    React.useEffect(() => {
    }, []);

    return (
        <FullScreenDialog
            title="Chi tiết đơn thuốc"
            buttons={buttons}
            open={open}
            handleClose={handleClose}
            containerStyle={{
                boxShadow: '0 3px 5px 2px #dadce0',
                height: '100%',
                marginTop: 32,
                background: '#fff',
                marginBottom: 32
            }}
        >
            <div className={classes.paper}>
                <Grid container spacing={3} justify="space-between" >
                    <Grid item xs={12}>
                        <Typography component="h4" variant="h4" style={{ textAlign: 'center' }}>
                            ĐƠN THUỐC
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {
                            value.customer &&
                            <Grid container>
                                <Grid item xs={8} >
                                    <Typography component="h5" variant="h5" gutterBottom>
                                        {`Họ & Tên KH: ${value.customer.name}`}
                                    </Typography>
                                    <Typography component="h5" variant="h5" gutterBottom>
                                        {`Địa chỉ: ${value.customer.address}`}
                                    </Typography>
                                    <Typography component="h5" variant="h5" gutterBottom>
                                        {`Điện thoại: ${value.customer.phone}`}
                                    </Typography>
                                    <Typography component="h5" variant="h5" gutterBottom>
                                        {`Chẩn đoán: ${value.result}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                    <Typography component="h5" variant="h5" gutterBottom style={{ textAlign: 'right' }}>
                                        {`Năm sinh: ${value.customer.dob}`}
                                    </Typography>
                                    <Typography component="h5" variant="h5" gutterBottom style={{ textAlign: 'right' }}>
                                        {`Giới tính: ${value.customer.gender}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    <Grid item xs={12} >
                        {
                            value.drugs &&
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    {value.drugs.map((drug, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td style={{ textAlign: 'left' }}>{drug.name}</td>
                                                <td style={{ textAlign: 'right' }}>{drug.quantity}</td>
                                                <td style={{ textAlign: 'center' }}>{drug.unit}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '100%' }}>{drug.usage}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container>
                            <Grid item xs={7}></Grid>
                            <Grid item xs={5}>
                                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                                    {`Ngày ${new Date().getDate()} tháng ${new Date().getMonth()} năm ${new Date().getFullYear()}`}
                                </Typography>
                                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                                    Bác sĩ
                                </Typography>
                                <br />
                                <br />
                                <br />
                                <Typography component="h5" variant="h5" style={{ textAlign: 'center' }}>
                                    {value.doctor}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Snackbar
                vertical="bottom"
                horizontal="right"
                variant={snackbarOption.variant}
                message={snackbarOption.message}
                open={openSnackbar}
                handleClose={handleSnackbarClose}
            />
        </FullScreenDialog>
    );
}

PrintForm.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    value: PropTypes.object
}

PrintForm.defaultProps = {
    open: false,
    handleClose: () => { },
    value: {}
}

export default PrintForm;
