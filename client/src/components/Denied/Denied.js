import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';

export default class Denied extends Component {
    render() {
        const actions = [
            <Link
                to="/"
            >
                <FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={this.handleClose}
                />
            </Link>
        ];
        return (
            <div>
                <Dialog
                    title="Denied"
                    open={true}
                    actions={actions}
                >
                    You are not authorized to view this page.
                </Dialog>
            </div>
        );
    }
}
