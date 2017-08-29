import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="pt60">
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ]).isRequired
};

export default App;
