import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import CheckBox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import Drawer from './../Drawer/Drawer';
import Header from './../Header/Header';
import data from './data';
import Auth from './../../modules/auth';
import './AddPost.scss';

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

// const disableMondays = date => date.getDay() === 1;

export default class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: '',
            title: '',
            body: '',
            launch: today,
            time: '12:00 pm',
            groups: [],
            location: 'the church',
            openDrawer: false,
            anchorEl: null,
            addMore: false,
            openSnack: false,
            openDialog: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleGroupCheck = this.handleGroupCheck.bind(this);
    }
    async onSubmit() {
        const res = await axios({
            method: 'post',
            url: '/api/addPost',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: this.state
        });
        if (res.data.success && this.state.addMore) {
            this.setState({
                activity: '',
                title: '',
                body: '',
                launch: today,
                time: '12:00 pm',
                groups: [],
                location: 'the church',
                openSnack: true
            });
        } else if (res.data.success) location.pathname = '/';
        else if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        } else {
            this.setState({
                activity: '',
                title: '',
                body: '',
                launch: today,
                time: '12:00 pm',
                groups: [],
                location: 'the church',
                openDialog: true
            });
        }
    }
    handleCheckBox() {
        this.setState({ addMore: !this.state.addMore });
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
    handleTitleChange(e, value) {
        this.setState({ title: value });
    }
    handleLocationChange(e, value) {
        this.setState({ location: value });
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
        this.setState({ openSnack: false, openDialog: false });
    }
    handleUpdateInput(value) {
        this.setState({
            location: value
        });
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
                                className="field-space"
                                floatingLabelFocusStyle={{ color: '#3498db' }}
                                underlineFocusStyle={{ borderColor: '#3498db' }}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                value={this.state.body}
                                className="field-space"
                                floatingLabelText="Description"
                                floatingLabelFocusStyle={{ color: '#3498db' }}
                                underlineFocusStyle={{ borderColor: '#3498db' }}
                                multiLine
                                onChange={this.handleDescChange}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '3px' }}>
                        <label htmlFor="party" className="drop-label">
                            Who: (Check all that apply)
                        </label>
                        <DropDownMenu
                            id="party"
                            multiple={true}
                            className="dropdown-menu"
                            value={this.state.groups}
                        >
                            {data.groups.map(group => (
                                <MenuItem
                                    key={group}
                                    value={group}
                                    primaryText={group}
                                    style={{ padding: '10px 16px 0px 72px' }}
                                    leftCheckbox={
                                        <CheckBox
                                            onCheck={this.handleGroupCheck}
                                            value={group}
                                            iconStyle={this.state.groups.indexOf(group) !== -1 ? { fill: '#3498db' } : { fill: '#000000' }}
                                            checked={this.state.groups.indexOf(group) !== -1}
                                        />
                                    }
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
                        className="field-space"
                        floatingLabelFocusStyle={{ color: '#3498db' }}
                        underlineFocusStyle={{ borderColor: '#3498db' }}
                        onChange={this.handleLocationChange}
                    />
                    <DatePicker
                        value={this.state.launch}
                        className="pointer field-space"
                        floatingLabelText="Activity Date"
                        firstDayOfWeek={0}
                        minDate={minDate}
                        maxDate={maxDate}
                        // shouldDisableDate={disableMondays}
                        formatDate={new DateTimeFormat('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }).format}
                        onChange={this.handleDateChange}
                    />
                    <label htmlFor="time" className="drop-label">
                        Start Time
                    </label>
                    <TimePicker
                        id="time"
                        value={today}
                        className="pointer"
                        hintText="Activity Begins"
                        minutesStep={5}
                        onChange={this.handleTimeChange}
                    />
                    <RaisedButton
                        aria-label="Submit Form"
                        label="Submit"
                        className="submit"
                        backgroundColor="#3498db"
                        labelColor="#ffffff"
                        onClick={this.onSubmit}
                    />
                    <CheckBox
                        label="Add More Posts"
                        labelStyle={{ color: 'gray' }}
                        className="add-more"
                        iconStyle={this.state.addMore ? { fill: '#1E5E87' } : { fill: '#000000' }}
                        onCheck={this.handleCheckBox}
                    />
                </div>
                <Drawer
                    user={this.props.route.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
                <Dialog
                    open={this.state.openDialog}
                    title="Error"
                    modal={false}
                    actions={errActions}
                    onRequestClose={this.handleRequestClose}
                >
                    {'An error occured while processing your request. Try again later.'}
                </Dialog>
                <Snackbar
                    open={this.state.openSnack}
                    message="Post Successfully Added"
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

AddPost.propTypes = {
    route: PropTypes.object.isRequired
};
