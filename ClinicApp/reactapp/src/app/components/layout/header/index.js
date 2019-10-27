import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import logo from '../../../../assets/images/logo.png';

import { LoginService } from '../../../services';

const useStyles = makeStyles(theme => ({
	toolbar: {
		paddingRight: 24,
	},

	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},

	avatar: {
		width: "60px",
		height: "auto",
	},

	menuButton: {
		marginRight: 15,
	},

	'@media screen and (max-width: 560px)': {
		title: {
			display: 'none',
		},
		avatar: {
			display: 'none',
		},
		toolbar: {
			paddingRight: 0,
		},
	},

	title: {
		flexGrow: 1,
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	
	btnLogout: {
		marginLeft: 'auto',
		textTransform: 'none',
	},

	icon: {
		marginLeft: 10,
	}
}));

const LogoutButton = withRouter((props) => {
    const { classes, history } = props;

    const handlLogout = () => {
        const { ok } = LoginService.Logout();
        if (ok) {
            history.push('/');
        }
    };

    return (
        <Button color="inherit" variant="text" className={classes.btnLogout} onClick={handlLogout}>
            Đăng xuất
			<ExitToAppIcon className={classes.icon} />
        </Button>
    );
});

const Header = (props) => {
    const classes = useStyles();

    return (
        <AppBar position="absolute" className={classes.appBar}>
			<Toolbar className={classes.toolbar}>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="open drawer"
					onClick={props.toggleSidebar}
					className={classes.menuButton}
				>
					<MenuIcon />
				</IconButton>
				<Avatar className={classes.avatar}
					alt="Hệ Thống Quản Lý Phòng Khám"
					src={logo}
				/>
				<Typography component="h6" variant="h6" color="inherit" noWrap className={classes.title}>
					Hệ Thống Quản Lý Phòng Khám
        		</Typography>
				<LogoutButton classes={classes} />
			</Toolbar>
		</AppBar>
    );
}

export default Header;
