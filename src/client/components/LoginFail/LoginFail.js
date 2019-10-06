import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

export default class LoginFail extends Component {
    render() {
        const actions = [
            <Link
                to="/"
            >
                <FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                />
            </Link>
        ];
        return (
            <div>
                <Dialog
                    title="Login Failed"
                    open={true}
                    actions={actions}
                >
                    {this.props.location.state}
                </Dialog>
            </div>
        );
    }
}

LoginFail.propTypes = {
    location: PropTypes.object.isRequired
};
