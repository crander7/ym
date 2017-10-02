import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import Auth from './../../modules/auth';

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }
    async componentWillMount() {
        const res = await axios({
            method: 'GET',
            url: '/api/getUser',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        console.log(res.data);
    }
    render() {
        return (
            <div>
                {this.state.user ? this.state.user.name : ''}
            </div>
        );
    }
}
