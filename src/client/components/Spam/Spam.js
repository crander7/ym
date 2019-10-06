import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';
import Header from './../Header/Header';
import Drawer from './../Drawer/Drawer';
import Auth from './../../modules/auth';

const selectedHelper = (selected, user) => {
    let found = false;
    for (let i = 0; i < selected.length; i += 1) {
        if (user.id === selected[i].id) found = true;
    }
    return found;
};

export default class Spam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            users: [],
            selected: [],
            message: ''
        };
        this.handleUserCheck = this.handleUserCheck.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'GET',
            url: '/api/getAllUsers',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data.success) {
            this.setState({ users: res.data.users });
        }
    }
    async handleSendMessage() {
        const res = await axios({
            method: 'POST',
            url: '/api/sendGroupMessage',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: { users: this.state.selected, message: this.state.message }
        });
        if (res.data.success) {
            this.setState({ selected: false, message: '' });
        }
    }
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    handleMessage(evt) {
        this.setState({ message: evt.target.value });
    }
    handleUserCheck(user) {
        const { selected } = this.state;
        if (!selectedHelper(selected, user)) selected.push(user);
        else selected.length = 0;
        this.setState({ selected });
    }
    render() {
        return (
            <div>
                <Header
                    toggleDrawer={this.toggleDrawer}
                />
                <div style={{ padding: '20px 50px' }}>
                    <TextField
                        name="group-text"
                        floatingLabelText="Message"
                        value={this.state.message}
                        onChange={this.handleMessage}
                    />
                    <FlatButton
                        primary
                        label="Send Message"
                        onClick={this.handleSendMessage}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <span>Send Message to Whom:</span>
                        {this.state.users && this.state.users.map(user => (
                            <div key={user.id}>
                                <CheckBox
                                    onCheck={() => { this.handleUserCheck(user); }}
                                    label={`${user.first_name} ${user.last_name}`}
                                    iconStyle={selectedHelper(this.state.selected, user) ? { fill: '#3498db' } : { fill: '#000000' }}
                                    checked={selectedHelper(this.state.selected, user)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <Drawer
                    user={this.props.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
            </div>
        );
    }
}

Spam.propTypes = {
    getUser: PropTypes.func.isRequired
};
