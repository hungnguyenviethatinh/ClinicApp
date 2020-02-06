import React from 'react';
import { Redirect } from 'react-router-dom';
import {
    CssBaseline,
    Typography,
    Container,
    Grid,
    Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import qs from 'querystring';

import { TextField } from '../../components/TextField';

import {
    ApiUrl,
    Audiance,
    ClientId,
    ClientSecret,
    LoginUrl,
    SetUserStatusUrl,
} from '../../config';
import { AccessTokenKey } from '../../constants';

const useStyles = makeStyles(theme => ({
    '@global': {
        '#progressBar': {
            margin: '-32px -16px 32px -16px',
            [theme.breakpoints.up('sm')]: {
                margin: '-32px -24px 32px -24px',
            },
            [theme.breakpoints.up('md')]: {
                margin: '-32px -32px 32px -32px',
            },
            [theme.breakpoints.up('lg')]: {
                margin: '-32px -32px 32px -32px',
            },
            [theme.breakpoints.up('xl')]: {
                margin: '-32px -32px 32px -32px',
            },
        },
        '#progress': {
            width: '0%',
            height: '3px',
            backgroundColor: theme.palette.primary.main,
            opacity: 0,
            transition: 'width 5s, opacity .5s',
        },
    },

    container: {
        height: '100vh',
    },

    head: {
        marginBottom: theme.spacing(3),
    },

    main: {
        boxShadow: '0 3px 5px 2px #dadce0',
        paddingTop: '32px',
        paddingBottom: '32px',
    },

    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = (props) => {
    const classes = useStyles();

    const { from } = props.location.state || { from: { pathname: '/' } };
    const [isLogined, setIsLogined] = React.useState(false);
    const [values, setValues] = React.useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = React.useState({
        invalidUsername: false,
        invalidPassword: false,
    });
    const [isProgressing, setIsProgressing] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleChangeUsername = event => {
        const { value } = event.target;
        setValues({ ...values, username: value });
        setErrors({ ...errors, invalidUsername: value === '' });
    };
    const handleChangePassword = event => {
        const { value } = event.target;
        setValues({ ...values, password: value });
        setErrors({ ...errors, invalidPassword: value === '' });
    };

    const showProgress = () => {
        document.getElementById('progress').style.width = '100%';
        document.getElementById('progress').style.opacity = 1;
        setIsProgressing(true);
        setErrorMessage('');
    };
    const hideProgress = () => {
        document.getElementById('progress').style.width = '0%';
        document.getElementById('progress').style.opacity = 0;
        setIsProgressing(false);
    };

    const handleLogin = user => {
        const url = ApiUrl + LoginUrl;
        const data = {
            grant_type: 'password',
            scope: `openid profile phone email roles ${Audiance}`,
            username: user.username,
            password: user.password,
            client_id: ClientId,
            client_secret: ClientSecret,
        };
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        axios.post(url, qs.stringify(data), config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { access_token } = data;
                localStorage.setItem(AccessTokenKey, access_token);
                setUserStatus(true);
            }
        }).catch((reason) => {
            hideProgress();

            if (reason.response) {
                const { status, data } = reason.response;
                if (status === 400) {
                    const { error } = data;
                    if (error === 'invalid_grant') {
                        setErrorMessage('Tài khoản hoặc mật khẩu không đúng.');
                        console.log('data: ', data);
                    } else {
                        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau!');
                        console.log('reponse: ', reason.response);
                    }
                } else {
                    setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau!');
                    console.log('reponse: ', reason.response);
                }
            } else {
                setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau!');
                console.error(reason);
            }
        });
    };

    const setUserStatus = (active) => {
        const url = ApiUrl + SetUserStatusUrl;

        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(AccessTokenKey)}`,
            },
            params: {
                active,
            },
        }).then((response) => {
            hideProgress();

            const { status } = response;
            if (status === 200) {
                console.log('[Set User Status] - OK!');
                setIsLogined(true);
            }
        }).catch((reason) => {
            hideProgress();
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau!');
            console.log('[Set User Status] ', reason);
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    setErrorMessage('Tài khoản hoặc mật khẩu không đúng.');
                    localStorage.removeItem(AccessTokenKey);
                }
            }
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (values.username !== '' && values.password !== '') {
            const user = {
                username: values.username,
                password: values.password,
            };
            showProgress();
            handleLogin(user);
        } else {
            setErrors({
                invalidUsername: !values.username.trim(),
                invalidPassword: !values.password.trim(),
            });
        }
    };

    return (
        <React.Fragment>
            {isLogined ?
                <Redirect to={from} />
                :
                <Grid container justify="center" alignItems="center" className={classes.container}>
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <Container component="div" maxWidth="xs" className={classes.main}>
                            <CssBaseline />
                            <div id="progressBar">
                                <div id="progress"></div>
                            </div>
                            <div className={clsx(classes.paper, classes.head)}>
                                <Typography color="primary" component="h4" variant="h4">
                                    ĐĂNG NHẬP HỆ THỐNG
                                </Typography>
                            </div>
                            <div className={classes.paper}>
                                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                                    <TextField
                                        required={true}
                                        fullWidth={true}
                                        id="username"
                                        name="username"
                                        label="Tài khoản"
                                        value={values.username}
                                        onChange={handleChangeUsername}
                                        autoFocus={true}
                                        error={errors.invalidUsername}
                                        helperText="Vui lòng nhập tài khoản của bạn!"
                                    />
                                    <TextField
                                        required={true}
                                        fullWidth={true}
                                        id="password"
                                        name="password"
                                        label="Mật khẩu"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChangePassword}
                                        error={errors.invalidPassword}
                                        helperText="Vui lòng nhập mật khẩu của bạn!"
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        id="buttonSignin"
                                        disabled={isProgressing}
                                    >
                                        ĐĂNG NHẬP
                                    </Button>
                                </form>
                                <div className={classes.paper}>
                                    <Typography 
                                        children={errorMessage} 
                                        color="error" 
                                        component="p" 
                                        variant="caption" 
                                    />
                                </div>
                            </div>
                        </Container>
                    </Grid>
                </Grid>

            }
        </React.Fragment>
    );
}

export default Login;
