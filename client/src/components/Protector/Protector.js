import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

export default class Protector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        };
        this.handlePassword = this.handlePassword.bind(this);
        this.checkForEnter = this.checkForEnter.bind(this);
    }
    handlePassword(e, password) {
        this.setState({ password });
    }
    checkForEnter(e) {
        if (e.keyCode === 13) this.props.check(this.state.password);
    }
    render() {
        return (
            <div className="protect post-creator">
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    onChange={this.handlePassword}
                    onKeyDown={this.checkForEnter}
                />
                <RaisedButton
                    label="Submit"
                    primary={true}
                    onClick={() => this.props.check(this.state.password)}
                />
                <Link
                    className="normalize-link"
                    to="/"
                    style={{ display: 'none' }}
                >
                    <RaisedButton id="hate-it" label="Home" />
                </Link>
            </div>
        );
    }
}

Protector.propTypes = {
    check: PropTypes.func.isRequired
};
