import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(2),
    },
}));

const Footer = () => {
    const classes = useStyles()
    return (
        <Typography className={classes.footer} variant="body2" color="textSecondary" align="center">
            {'Bản quyền © '}
            {new Date().getFullYear()}
            {' '}
            <Link color="inherit" to="/" >
                Dr.KHOA Clinic
            </Link>{' '}
            {'.'}
        </Typography>
    );
}

export default Footer;
