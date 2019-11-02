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
    container: {
        height: '100%',
    },
    content: {
        paddingTop: 32,
        paddingBottom: 32,
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = props => {
    const classes = useStyles();

    const { open, children, title, buttons, handleClose, maxWidth, containerStyle } = props;

    return (
        <React.Fragment>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography color="inherit" variant="h5" className={classes.title}>
                            {title}
                        </Typography>
                        {
                            buttons.map((button, index) => {
                                return (
                                    <Button
                                        key={index}
                                        autoFocus
                                        color="inherit"
                                        variant="text"
                                        children={button.children}
                                        iconName={button.iconName}
                                        onClick={button.onClick}
                                        style={{margin: '0 8px'}}
                                    />
                                )
                            })
                        }
                        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <CssBaseline />
                <Grid container justify="center" className={classes.container}>
                    <Grid item sm={12}>
                        <Container maxWidth={maxWidth} className={classes.content} style={containerStyle}>
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
    maxWidth: PropTypes.string,
}

FullScreenDialog.defaultProps = {
    open: false,
    children: <React.Fragment />,
    title: '',
    buttons: [],
    handleClose: () => { console.log('Close diaglog!') },
    maxWidth: 'sm',
}

export default FullScreenDialog;
