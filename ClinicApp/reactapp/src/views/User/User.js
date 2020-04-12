import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Container,
    Typography
} from '@material-ui/core';

import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';

import Axios, { axiosRequestConfig } from '../../common';
import { GetCurrentUserUrl, UpdateCurrentUserUrl } from '../../config';
import { ExpiredSessionMsg, NotFoundMsg } from '../../constants';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(0),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

const getMyInfoError = '[Get My Info Error]';
const updateMyInfoError = '[Update My Info Error]';

const UserView = () => {

    const classes = useStyles();

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
        setOpenSnackbar(true);
    };

    const handleError = (reason, logMsgHeader) => {
        if (reason.response) {
            const { status } = reason.response;
            if (status === 401) {
                handleSnackbarOption('error', ExpiredSessionMsg);
            } else {
                if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
        }
        console.log(`${logMsgHeader}`, reason);
    }

    const [user, setUser] = React.useState({
        FullName: '',
        Role: '',
        Email: '',
        PhoneNumber: '',
        CurrentPassword: '',
        NewPassword: '',
    });
    const handleValueChange = prop => event => {
        setUser({
            ...user,
            [prop]: event.target.value,
        })
    };

    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleReset = () => {
        getMyInfo();
    };

    const handleSave = () => {
        if (!user.FullName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
            return;
        }
        // if (!user.Email.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập email!');
        //     return;
        // }
        // if (!user.PhoneNumber.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại!');
        //     return;
        // }
        if (user.CurrentPassword.trim() && !user.NewPassword.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mật khẩu mới!');
            return;
        }
        if (!user.CurrentPassword.trim() && user.NewPassword.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mật khẩu hiện tại!');
            return;
        }

        setDisabled(true);
        setLoading(true);

        const userModel = {
            FullName: user.FullName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            CurrentPassword: user.CurrentPassword,
            NewPassword: user.NewPassword,
        };
        updateMyInfo(userModel);
    };

    const config = axiosRequestConfig();

    const updateMyInfo = (userModel) => {
        Axios.put(UpdateCurrentUserUrl, userModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { fullName, email, phoneNumber } = data;
                setUser({
                    ...user,
                    FullName: fullName,
                    Email: email,
                    PhoneNumber: phoneNumber,
                    CurrentPassword: '',
                    NewPassword: '',
                });
                handleSnackbarOption('success', 'Cập nhật thông tin của bạn thành công!');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bạn!');
            }
            setDisabled(false);
            setLoading(false);
        }).catch((reason) => {
            handleError(reason, updateMyInfoError);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bạn!');
            setDisabled(false);
            setLoading(false);
        });
    };

    const getMyInfo = () => {
        setDisabled(true);
        Axios.get(GetCurrentUserUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { currentUser, roles } = data[0];
                const { fullName, email, phoneNumber } = currentUser;
                const role = roles[0];

                setUser({
                    ...user,
                    FullName: fullName,
                    Role: role,
                    Email: email,
                    PhoneNumber: phoneNumber,
                    CurrentPassword: '',
                    NewPassword: '',
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMyInfoError);
            setDisabled(false);
        });
    };

    React.useEffect(() => {
        getMyInfo();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN CỦA BẠN"
                        subheader="Cập nhật thông tin của bạn"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Container maxWidth="sm">
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            id="FullName"
                                            label="Họ & Tên"
                                            value={user.FullName}
                                            onChange={handleValueChange('FullName')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="Role"
                                            label="Chức vụ"
                                            value={user.Role}
                                            readOnly
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="Email"
                                            label="Email"
                                            value={user.Email}
                                            onChange={handleValueChange('Email')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="PhoneNumber"
                                            label="Số điện thoại"
                                            value={user.PhoneNumber}
                                            onChange={handleValueChange('PhoneNumber')}
                                            maxLength={10}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Typography
                                            variant="caption"
                                            component="h5"
                                            children="Thay đổi mật khẩu"
                                        />
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="CurrentPassword"
                                            type="password"
                                            label="Mật khẩu hiện tại"
                                            value={user.CurrentPassword}
                                            onChange={handleValueChange('CurrentPassword')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="NewPassword"
                                            type="password"
                                            label="Mật khẩu mới"
                                            value={user.NewPassword}
                                            onChange={handleValueChange('NewPassword')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid container justify="flex-end" spacing={2}>
                                            <Grid item>
                                                <Button
                                                    color="warning"
                                                    children="Đặt lại"
                                                    iconName="reset"
                                                    onClick={handleReset}
                                                    disabled={disabled}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    color="success"
                                                    children="Cập nhật"
                                                    iconName="save"
                                                    onClick={handleSave}
                                                    disabled={disabled}
                                                    loading={loading}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Snackbar
                vertical="bottom"
                horizontal="right"
                variant={snackbarOption.variant}
                message={snackbarOption.message}
                open={openSnackbar}
                handleClose={handleSnackbarClose}
            />
        </Grid>
    );
};

export default UserView;
