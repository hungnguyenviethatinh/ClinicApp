import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
import { Settings } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		minHeight: 'fit-content'
	},
	avatar: {
		width: 60,
		height: 60
	},
	name: {
		marginTop: theme.spacing(1)
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const Profile = props => {
	const { className, ...rest } = props;

	const classes = useStyles();

	const user = JSON.parse(localStorage.getItem('user'));

	return (
		<div
			{...rest}
			className={clsx(classes.root, className)}
		>
			{
				user &&
				<React.Fragment>
					<div style={{
						position: 'absolute',
						right: 0,
						top: -10,
					}}>
						<Link to="/user">
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
						{user.name}
					</Typography>
					<Typography variant="body2">{user.role}</Typography>
				</React.Fragment>
			}
		</div>
	);
};

Profile.propTypes = {
	className: PropTypes.string
};

export default Profile;
