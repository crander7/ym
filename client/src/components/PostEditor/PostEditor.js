import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import Home from 'material-ui/svg-icons/action/home';
import Edit from 'material-ui/svg-icons/image/edit';
import Add from 'material-ui/svg-icons/content/add-circle';
import History from 'material-ui/svg-icons/action/history';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import Drawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
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

const disableMondays = date => date.getDay() === 1;

const parseIncomingTime = (timeStr) => {
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
};

export default class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postId: null,
            party: '',
            activity: '',
            title: '',
            body: '',
            launch: null,
            time: null,
            timeObj: new Date(),
            open: false,
            anchorEl: null,
            authorized: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
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
                activity: post.activity,
                party: post.party,
                launch: new Date(post.start_date),
                time: post.start_time,
                timeObj: parseIncomingTime(post.start_time)
            });
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
    }
    handleGroupChange(e, idx, party) {
        this.setState({ party });
    }
    handleTypeChange(e, idx, activity) {
        this.setState({ activity });
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
    toggleDrawer(open, anchorEl) {
        this.setState({ open, anchorEl });
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
                                multiLine={true}
                                rows={4}
                                onChange={this.handleDescChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="party" className="drop-label">
                            Who:
                        </label>
                        <DropDownMenu
                            id="party"
                            value={this.state.party}
                            onChange={this.handleGroupChange}
                        >
                            {data.groups.map(party => (
                                <MenuItem
                                    key={party}
                                    value={party}
                                    primaryText={party}
                                />
                            ))}
                        </DropDownMenu>
                        <label htmlFor="activity" className="drop-label">Activity Category</label>
                        <DropDownMenu
                            id="activity"
                            value={this.state.activity}
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
                    <DatePicker
                        value={this.state.launch}
                        className="pointer"
                        floatingLabelText="Activity Date"
                        firstDayOfWeek={0}
                        shouldDisableDate={disableMondays}
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
                        label="Submit"
                        backgroundColor="#4BC0EA"
                        labelColor="white"
                        onClick={this.onSubmit}
                    />
                </div>
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={open => this.setState({ open })}
                >
                    <List>
                        <Link
                            to="/"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Home" leftIcon={<Home />} />
                        </Link>
                        <Link
                            to="/addPost"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Add Post"
                                leftIcon={<Add />}
                            />
                        </Link>
                        <Link
                            to="/editPosts"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Edit Posts" leftIcon={<Edit />} />
                        </Link>
                        <Link
                            to="/pastActivities"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Past Posts"
                                leftIcon={<History />}
                            />
                        </Link>
                    </List>
                </Drawer>
            </div>
        );
    }
}

PostEditor.propTypes = {
    params: PropTypes.object.isRequired
};
