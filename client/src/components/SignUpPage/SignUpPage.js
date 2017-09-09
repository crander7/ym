import React, { Component } from 'react';
import axios from 'axios';
import SignUpForm from './components/SignUpForm';


export default class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            user: {
                email: '',
                name: '',
                password: ''
            }
        };
        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
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
            localStorage.setItem('successMessage', res.data.message);
            location.pathname = '/login';
        } else {
            const errors = res.data.errors ? res.data.errors : {};
            errors.summary = res.data.message;
            this.setState({ errors });
        }
    }
    render() {
        return (
            <SignUpForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}
            />
        );
    }
}
