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
        message: 'Data loaded successfully!',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
        setOpenSnackbar(true);
    };

    const [values, setValues] = React.useState({
        ID: '',
        FullName: '',
        Role: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        NewPassword: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };

    const handleResetValue = () => {

    };

    const handleSaveValue = () => {
        handleSnackbarOption('info', 'Cập nhật thông tin của bạn thành công!')
    };

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setValues({
            ...values,
            ID: user.id,
            FullName: user.name,
            Email: user.email,
            Role: user.role,
            PhoneNumber: user.phonenumber,
        });
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
                                <Grid container spacing={2} >
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            id="ID"
                                            label="Mã Nhân Viên"
                                            value={values.ID}
                                            onChange={handleValueChange('ID')}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            id="FullName"
                                            label="Họ & Tên"
                                            value={values.FullName}
                                            onChange={handleValueChange('FullName')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="Role"
                                            label="Chức vụ"
                                            value={values.Role}
                                            onChange={handleValueChange('Role')}
                                            readOnly
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="Email"
                                            label="Email"
                                            value={values.Email}
                                            onChange={handleValueChange('Email')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="PhoneNumber"
                                            label="Số điện thoại"
                                            value={values.PhoneNumber}
                                            onChange={handleValueChange('PhoneNumber')}
                                            maxLength={10}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Typography variant="h5" component="h5">
                                            Thay đổi mật khẩu
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="Password"
                                            type="password"
                                            label="Mật khẩu hiện tại"
                                            value={values.Password}
                                            onChange={handleValueChange('Password')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            fullWidth
                                            id="NewPassword"
                                            type="password"
                                            label="Mật khẩu mới"
                                            value={values.NewPassword}
                                            onChange={handleValueChange('NewPassword')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid container justify="flex-end" spacing={2}>
                                            <Grid item>
                                                <Button
                                                    color="info"
                                                    children="Đặt lại"
                                                    iconName="reset"
                                                    onClick={handleResetValue}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    color="primary"
                                                    children="Lưu"
                                                    iconName="save"
                                                    onClick={handleSaveValue}
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
