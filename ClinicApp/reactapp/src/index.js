import React from 'react';
import ReactDom from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Theme from './app/themes';
import App from './app';

const root = document.getElementById('root');
ReactDom.render(
    <ThemeProvider theme={Theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <App />
        </MuiPickersUtilsProvider>
    </ThemeProvider>
    , root);
