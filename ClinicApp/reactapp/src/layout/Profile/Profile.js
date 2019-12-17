import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { decodeJWT } from '../../common';
import {
	RouteConstants,
	AccessTokenKey,
} from '../../constants';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		minHeight: 'fit-content',
		padding: theme.spacing(2, 0),
	},
	avatar: {
		width: 60,
		height: 60
	},
	name: {
		marginTop: theme.spacing(1),
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const Profile = props => {
	const { className, ...rest } = props;

	const classes = useStyles();

	const [currentUser, setCurrentUser] = React.useState({
		fullname: '',
		role: '',
	});

	React.useEffect(() => {
		const token = localStorage.getItem(AccessTokenKey);

		if (token) {
			const decoded = decodeJWT(token);
			if (decoded.fullname && decoded.role) {
				const { fullname, role } = decoded;
				setCurrentUser({
					fullname,
					role,
				});
			}
		}
	}, []);

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}
		>
			<div style={{
				position: 'absolute',
				right: 0,
				top: -10,
			}}>
				<Link to={RouteConstants.UserView}>
					<IconButton
						aria-label="user"
						className={classes.margin}
						fontSize="medium"
					>
						<Settings fontSize="inherit" />
					</IconButton>
				</Link>
			</div>
			<Typography
				className={classes.name}
				variant="h4"
			>
				{currentUser.fullname}
			</Typography>
			<Typography variant="body2">{currentUser.role}</Typography>
		</div>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default Profile;
