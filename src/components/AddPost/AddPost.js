import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import Drawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Header from './../Header/Header';
import data from './data';
import './AddPost.css';

const today = new Date();
today.setHours(12, 0, 0, 0);
const minDate = new Date();
const maxDate = new Date();
minDate.setFullYear(minDate.getFullYear());
minDate.setHours(0, 0, 0, 0);
maxDate.setFullYear(maxDate.getFullYear() + 2);
maxDate.setHours(0, 0, 0, 0);

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

export default class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            party: '',
            activity: '',
            title: '',
            body: '',
            launch: today,
            time: '',
            open: false,
            anchorEl: null
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
    async onSubmit() {
        const res = await axios({
            method: 'post',
            url: 'api/addPost',
            data: this.state
        });
        if (res.data.success) {
            this.setState({
                party: '',
                activity: '',
                title: '',
                body: '',
                launch: today,
                time: ''
            });
        }
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
                        minDate={minDate}
                        maxDate={maxDate}
                        shouldDisableDate={disableMondays}
                        formatDate={new DateTimeFormat('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }).format}
                        onChange={this.handleDateChange}
                    />
                    <TimePicker
                        value={today}
                        className="pointer"
                        hintText="Activity Begins"
                        minutesStep={5}
                        onChange={this.handleTimeChange}
                    />
                    <RaisedButton
                        label="Submit"
                        primary={true}
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
                            <ListItem primaryText="Home" />
                        </Link>
                        <Link
                            to="/editPosts"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Edit Posts" />
                        </Link>
                    </List>
                </Drawer>
            </div>
        );
    }
}
