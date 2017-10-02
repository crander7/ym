import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SignUpForm from './components/SignUpForm';
import SignUpLanding from './components/SignUpLanding';
import Auth from './../../modules/auth';
import './SignUpPage.css';

const today = new Date();
today.setFullYear(today.getFullYear() - 16);

export default class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            user: {
                email: '',
                name: '',
                password: '',
                birthday: today,
                editor: false
            }
        };
        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    }
    changeUser(event, val) {
        const user = this.state.user;
        if (event) {
            const field = event.target.name;
            user[field] = event.target.value;
        }
        if (!event) user.birthday = val;
        this.setState({ user });
    }
    async processForm(event) {
        event.preventDefault();
        const res = await axios({
            method: 'POST',
            url: '/auth/signup',
            data: this.state.user
        });
        if (res.data.success) {
            this.setState({ errors: {} });
            Auth.authenticateUser(res.data.token);
            location.pathname = '/';
        } else if (!res.data.success) {
            const errors = res.data.errors ? res.data.errors : {};
            errors.summary = res.data.message;
            this.setState({ errors });
        }
    }
    /* eslint-disable */
    handleCheckboxClick(e, checked) {
        const { user } = this.state;
        user.editor = checked;
        this.setState({ user });
    }
    render() {
        return (
            <div>
                {!this.props.landing && <SignUpForm
                    onSubmit={this.processForm}
                    onChange={this.changeUser}
                    errors={this.state.errors}
                    user={this.state.user}
                    checkChange={this.handleCheckboxClick}
                />}
                {this.props.landing && <SignUpLanding
                    closeLogin={this.props.closeLogin}
                />}
            </div>
        );
    }
}

SignUpPage.defaultProps = {
    closeLogin: null,
    landing: false
};

SignUpPage.propTypes = {
    closeLogin: PropTypes.func,
    landing: PropTypes.bool
};
