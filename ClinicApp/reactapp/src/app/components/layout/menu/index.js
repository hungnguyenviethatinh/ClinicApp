import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import TrendingUp from '@material-ui/icons/TrendingUp';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ViewListIcon from '@material-ui/icons/ViewList';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        paddingTop: 0,
    },

    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const ListItemLink = props => {
    return <ListItem button component={Link} {...props} />;
}

const Menu = (props) => {
    const classes = useStyles();
    const { currentIndex, changeCurrentIndex } = props;

    const [open, setOpen] = React.useState(props.open);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setOpen(!open);
        if (!props.open) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl) && !props.open;

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
        >
            <ListItemLink
                to="/"
                selected={currentIndex === 0}
                onClick={(index) => changeCurrentIndex(0)}
            >
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Overview" />
            </ListItemLink>
            <ListItemLink
                to="/policy-list"
                selected={currentIndex === 1}
                onClick={(index) => changeCurrentIndex(1)}
            >
                <ListItemIcon>
                    <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary="Policy List" />
            </ListItemLink>
            <ListItemLink
                to="/traceability"
                selected={currentIndex === 2}
                onClick={(index) => changeCurrentIndex(2)}
            >
                <ListItemIcon>
                    <TrendingUp />
                </ListItemIcon>
                <ListItemText primary="Traceability" />
            </ListItemLink>
            <ListItem button component="a" onClick={handleClick}>
                <ListItemIcon>
                    <FileCopyIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                {(props.open && open) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List component="div" disablePadding>
                    <ListItemLink
                        className={classes.nested}
                        to="/stp"
                        selected={currentIndex === 3}
                        onClick={(index) => changeCurrentIndex(3)}
                    >
                        <ListItemText primary="STP" />
                    </ListItemLink>
                    <ListItemLink
                        className={classes.nested}
                        to="/tree-summary"
                        selected={currentIndex === 4}
                        onClick={(index) => changeCurrentIndex(4)}
                    >
                        <ListItemText primary="Tree Summary" />
                    </ListItemLink>
                    <ListItemLink
                        className={classes.nested}
                        to="/summary-of-reject"
                        selected={currentIndex === 5}
                        onClick={(index) => changeCurrentIndex(5)}
                    >
                        <ListItemText primary="Summary of reject" />
                    </ListItemLink>
                </List>
            </Popover>
            <Collapse in={(props.open && open)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemLink
                        className={classes.nested}
                        to="/stp"
                        selected={currentIndex === 3}
                        onClick={(index) => changeCurrentIndex(3)}
                    >
                        <ListItemText primary="STP" />
                    </ListItemLink>
                    <ListItemLink
                        className={classes.nested}
                        to="/tree-summary"
                        selected={currentIndex === 4}
                        onClick={(index) => changeCurrentIndex(4)}
                    >
                        <ListItemText primary="Tree Summary" />
                    </ListItemLink>
                    <ListItemLink
                        className={classes.nested}
                        to="/summary-of-reject"
                        selected={currentIndex === 5}
                        onClick={(index) => changeCurrentIndex(5)}
                    >
                        <ListItemText primary="Summary of reject" />
                    </ListItemLink>
                </List>
            </Collapse>
        </List>
    );
}

export default Menu;
