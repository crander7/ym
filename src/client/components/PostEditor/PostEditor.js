import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CheckBox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import Drawer from './../Drawer/Drawer';
import Header from './../Header/Header';
import Auth from './../../modules/auth';
import data from './../AddPost/data';

let DateTimeFormat;

if (areIntlLocalesSupported(['fr', 'fa-IR'])) {
    DateTimeFormat = global.Intl.DateTimeFormat;
} else {
    const IntlPolyfill = require('intl'); // eslint-disable-line
    DateTimeFormat = IntlPolyfill.DateTimeFormat;
    require('intl/locale-data/jsonp/fr'); // eslint-disable-line
    require('intl/locale-data/jsonp/fa-IR'); // eslint-disable-line
}

// const disableMondays = date => date.getDay() === 1;

const parseIncomingTime = (timeStr) => {
    if (timeStr) {
        const today = new Date();
        let hourNotation = null;
        if (timeStr.length === 7) hourNotation = timeStr.slice(4);
        else hourNotation = timeStr.slice(5);
        hourNotation = hourNotation.trim();
        const timeArr = timeStr.split(':');
        timeArr[1] = timeArr[1].substring(0, 2);
        if (hourNotation.charAt(0) === 'a') {
            if (timeArr[0] === '12') {
                today.setHours(0);
                today.setMinutes(Number(timeArr[1]));
            } else {
                today.setHours(Number(timeArr[0]));
                today.setMinutes(Number(timeArr[1]));
            }
        } else if (timeArr[0] === '12') {
            today.setHours(12);
            today.setMinutes(Number(timeArr[1]));
        } else {
            today.setHours(12 + Number(timeArr[0]));
            today.setMinutes(Number(timeArr[1]));
        }
        return today;
    }
    return null;
};

export default class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postId: null,
            groups: [],
            activity: '',
            title: '',
            body: '',
            launch: new Date(),
            location: '',
            time: null,
            timeObj: new Date(),
            openDrawer: false,
            anchorEl: null,
            authorized: false,
            openDialog: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleGroupCheck = this.handleGroupCheck.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: `/api/getPost/${this.props.params.postID}`,
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data[0]) {
            const post = res.data[0];
            this.setState({
                postId: post.id,
                title: post.title,
                body: post.body,
                groups: post.groups,
                location: post.location,
                activity: post.activity,
                launch: new Date(post.start_date),
                time: post.start_time,
                timeObj: parseIncomingTime(post.start_time)
            });
        } else if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        } else if (res.data.error) {
            this.setState({ openDialog: true });
        }
    }
    async onSubmit() {
        const res = await axios({
            method: 'put',
            url: '/api/updatePost',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: this.state
        });
        if (res.data.success) location.pathname = '/';
        else if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        } else {
            this.setState({ openDialog: true });
        }
    }
    handleGroupCheck(evt, checked) {
        const { groups } = this.state;
        if (checked) groups.push(evt.target.value);
        else groups.splice(groups.indexOf(evt.target.value), 1);
        this.setState({ groups });
    }
    handleTypeChange(e, idx, activity) {
        this.setState({ activity });
    }
    handleLocationChange(e, location) {
        this.setState({ location });
    }
    handleTitleChange(e, value) {
        this.setState({ title: value });
    }
    handleDescChange(e, value) {
        this.setState({ body: value });
    }
    handleDateChange(e, value) {
        this.setState({ launch: value });
    }
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    handleRequestClose() {
        this.setState({ openDialog: false });
    }
    handleTimeChange(e, value) {
        let hour = value.getHours();
        let minute = value.getMinutes();
        if (minute < 10) minute = `0${minute}`;
        if (hour > 12) {
            hour -= 12;
            this.setState({ time: `${hour}:${minute} pm` });
        } else if (hour === 12) {
            this.setState({ time: `${hour}:${minute} pm` });
        } else if (hour === 0) {
            hour = 12;
            this.setState({ time: `${hour}:${minute} am` });
        } else this.setState({ time: `${hour}:${minute} am` });
    }
    render() {
        const errActions = [
            <FlatButton
                label="Okay"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleRequestClose}
            />
        ];
        return (
            <div>
                <Header toggleDrawer={this.toggleDrawer} />
                <div className="post-creator">
                    <div>
                        <div>
                            <TextField
                                value={this.state.title}
                                floatingLabelText="Post Title"
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                value={this.state.body}
                                floatingLabelText="Description"
                                multiLine
                                onChange={this.handleDescChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="party" className="drop-label">
                        Who: (Check all that apply)
                        </label>
                        <DropDownMenu
                            id="party"
                            autoWidth={false}
                            multiple={true}
                            className="dropdown-menu"
                            value={this.state.groups}
                            style={{ width: '80vw' }}
                        >
                            {data.groups.map(group => (
                                <MenuItem
                                    key={group}
                                    leftCheckbox={
                                        <CheckBox
                                            onCheck={this.handleGroupCheck}
                                            value={group}
                                            checked={this.state.groups.indexOf(group) !== -1}
                                        />
                                    }
                                    value={group}
                                    primaryText={group}
                                    style={{ padding: '10px 16px 0px 72px' }}
                                />
                            ))}
                        </DropDownMenu>
                        <label htmlFor="activity" className="drop-label">Activity Category</label>
                        <DropDownMenu
                            id="activity"
                            value={this.state.activity}
                            className="dropdown-menu"
                            onChange={this.handleTypeChange}
                        >
                            {data.types.map(activity => (
                                <MenuItem
                                    key={activity}
                                    value={activity}
                                    primaryText={activity}
                                />
                            ))}
                        </DropDownMenu>
                    </div>
                    <TextField
                        value={this.state.location}
                        floatingLabelText="Meeting Location"
                        onChange={this.handleLocationChange}
                    />
                    <DatePicker
                        value={this.state.launch}
                        className="pointer"
                        floatingLabelText="Activity Date"
                        firstDayOfWeek={0}
                        // shouldDisableDate={disableMondays}
                        formatDate={new DateTimeFormat('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }).format}
                        onChange={this.handleDateChange}
                    />
                    <TimePicker
                        value={this.state.timeObj}
                        className="pointer"
                        hintText="Activity Begins"
                        minutesStep={5}
                        onChange={this.handleTimeChange}
                    />
                    <RaisedButton
                        aria-label="Submit Form"
                        label="Submit"
                        className="submit"
                        backgroundColor="#4BC0EA"
                        labelColor="#ffffff"
                        onClick={this.onSubmit}
                    />
                </div>
                <Drawer
                    user={this.props.route.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
                <Dialog
                    title="Error"
                    open={this.state.openDialog}
                    modal={false}
                    onRequestClose={this.handleRequestClose}
                    actions={errActions}
                >
                    {'An error occured processing your request.'}
                </Dialog>
            </div>
        );
    }
}

PostEditor.propTypes = {
    params: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};
