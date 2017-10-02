import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Auth from './../../modules/auth';
import LoginForm from './components/LoginForm';
import './LoginPage.css';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        const storedMessage = localStorage.getItem('successMessage');
        let successMessage = '';
        if (storedMessage) {
            successMessage = storedMessage;
            localStorage.removeItem('successMessage');
        }
        this.state = {
            errors: {},
            successMessage,
            user: {
                email: '',
                password: ''
            }
        };
        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }
    async processForm(event) {
        event.preventDefault();
        const res = await axios({
            method: 'POST',
            url: '/auth/login',
            data: this.state.user
        });
        if (res.data.success) {
            this.setState({
                errors: {}
            });
            Auth.authenticateUser(res.data.token);
            location.pathname = '/';
        } else {
            const errors = res.data.errors ? res.data.errors : {};
            errors.summary = res.data.message;
            this.setState({
                errors
            });
        }
    }
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({
            user
        });
    }
    render() {
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                successMessage={this.state.successMessage}
                user={this.state.user}
                closeLogin={this.props.closeLogin}
                // ldsCheck={this.props.ldsCheck}
            />
        );
    }
}

LoginPage.defaultProps = {
    closeLogin: null
};

LoginPage.propTypes = {
    closeLogin: PropTypes.func
    // ldsCheck: PropTypes.func.isRequired
};
