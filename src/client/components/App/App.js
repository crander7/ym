import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './../../routes';
import './App.scss';


export default () => (
    <MuiThemeProvider>
        <Routes />
    </MuiThemeProvider>
);
