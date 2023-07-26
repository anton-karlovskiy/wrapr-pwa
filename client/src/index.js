
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import 'typeface-roboto';

import theme from './theme/muiTheme';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

const app = (
    <Fragment>
        <CssBaseline />
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <App />
                </Provider>
            </MuiThemeProvider>
        </BrowserRouter>
    </Fragment>
);

ReactDOM.render(app, document.getElementById( 'root' ));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
