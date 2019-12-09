import React from 'react';
import ReactDom from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/vi';
import Theme from './theme';
import App from './App';
import './assets/scss/styles.scss';

const locale = 'vi';
moment.locale(locale);

const root = document.getElementById('root');
ReactDom.render(
    <ThemeProvider theme={Theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider
             libInstance={moment}
             utils={MomentUtils}
             locale={locale}
        >
            <App />
        </MuiPickersUtilsProvider>
    </ThemeProvider>
    , root);
