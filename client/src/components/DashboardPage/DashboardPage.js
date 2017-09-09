import React, { Component } from 'react';
import axios from 'axios';
import Auth from './../../modules/auth';
import Dashboard from './components/Dashboard';

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secretData: ''
        };
    }
    async componentDidMount() {
        const res = await axios({
            method: 'GET',
            url: '/api/dashboard',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data.success) {
            this.state.secretData = res.data.message;
        }
    }
    render() {
        return (<Dashboard secretData={this.state.secretData} />);
    }
}
