import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '../button';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = props => {
    const classes = useStyles();

    const { open, children, title, buttons, handleClose } = props;

    return (
        <React.Fragment>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        {
                            buttons.map(button => {
                                return (
                                    <Button
                                        autoFocus
                                        color="inherit"
                                        variant="text"
                                        children={button.children}
                                        iconName={button.iconName}
                                        onClick={button.onClick}
                                    />
                                )
                            })
                        }
                    </Toolbar>
                </AppBar>
                <CssBaseline />
                <Grid container spacing={3} justify="center">
                    <Grid item sm={12}>
                        <Container maxWidth="sm">
                            <CssBaseline />
                            {children}
                        </Container>
                    </Grid>
                </Grid>
            </Dialog>
        </React.Fragment>
    );
}

FullScreenDialog.propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string,
    buttons: PropTypes.array,
    handleClose: PropTypes.func,
}

export default FullScreenDialog;
