import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const Footer = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Bản quyền © '}
            {new Date().getFullYear()}
            {' '}
            <Link color="inherit" to="/" >
                Hệ Thống Quản lý Phòng khám
            </Link>{' '}
            {'.'}
        </Typography>
    );
}

export default Footer;
