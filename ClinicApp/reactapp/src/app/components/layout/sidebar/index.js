import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import StoreIcon from '@material-ui/icons/Store';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ViewListIcon from '@material-ui/icons/ViewList';

import Menu from '../menu';
import { UserService } from '../../../services';
import { ROLES } from '../../../configs';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up('lg')]: {
            marginTop: 64,
            height: 'calc(100% - 64px)'
        }
    },
    root: {
        backgroundColor: theme.palette.white,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: theme.spacing(2)
    },
    nav: {
        marginBottom: theme.spacing(2)
    }
}));

const adminMenus = [
    {
        title: 'Bảng điều khiển',
        href: '/dashboard',
        icon: <DashboardIcon />
    },
    {
        title: 'Quản lí người dùng',
        href: '/user',
        icon: <PeopleIcon />
    },
    {
        title: 'Quản lí kho',
        href: '/store',
        icon: <StoreIcon />
    },
    {
        title: 'Thống kê',
        href: '/statistic',
        icon: <EqualizerIcon />
    },
];

const doctorMenus = [
    {
        title: 'Bảng điều khiển',
        href: '/dashboard',
        icon: <DashboardIcon />
    },
    // {
    //     title: 'Danh sách bệnh nhân',
    //     href: '/client',
    //     icon: <ViewListIcon />
    // },
    {
        title: 'Hồ sơ bệnh nhân',
        href: '/patient',
        icon: <PermContactCalendarIcon />
    },
    // {
    //     title: 'Danh sách hóa đơn',
    //     href: '/invoice',
    //     icon: <ReceiptIcon />
    // },
];

const receptionistMenus = [
    {
        title: 'Bảng điều khiển',
        href: '/dashboard',
        icon: <DashboardIcon />
    },
    // {
    //     title: 'Danh sách bệnh nhân',
    //     href: '/client',
    //     icon: <ViewListIcon />
    // },
    // {
    //     title: 'Danh sách bác sĩ',
    //     href: '/doctor',
    //     icon: <ViewListIcon />
    // },
    {
        title: 'Danh sách đơn thuốc',
        href: '/invoice',
        icon: <ReceiptIcon />
    },
];

const Sidebar = props => {
    const { open, variant, onClose, className, ...rest } = props;

    const classes = useStyles();

    const [menus, setMenus] = React.useState([]);

    const prepareMenus = () => {
        const user = UserService.GetCurrentUser();
        const role = user.role || '';

        switch (role) {
            case ROLES.ADMIN:
                setMenus(adminMenus);
                break;
            case ROLES.DOCTOR:
                setMenus(doctorMenus);
                break;
            case ROLES.RECEPTIONIST:
                setMenus(receptionistMenus);
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        prepareMenus();
    }, []);

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <div
                {...rest}
                className={clsx(classes.root, className)}
            >
                <Menu
                    className={classes.nav}
                    menus={menus}
                />
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired
};

export default Sidebar;
