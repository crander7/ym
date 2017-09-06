import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
// import AutoComplete from 'material-ui/AutoComplete';
import CheckBox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import Home from 'material-ui/svg-icons/action/home';
import Edit from 'material-ui/svg-icons/image/edit';
import History from 'material-ui/svg-icons/action/history';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import Drawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Header from './../Header/Header';
import Protector from './../Protector/Protector';
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
            anchorEl: null,
            authorized: false,
            addMore: false,
            openSnack: false
            // dataSource: ['Church', 'Brother Andersen\'s House', 'Hillcrest Park'],
            // location: null
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }
    async onSubmit() {
        const res = await axios({
            method: 'post',
            url: '/api/addPost',
            data: this.state
        });
        if (res.data.success && this.state.addMore) {
            this.setState({
                party: '',
                activity: '',
                title: '',
                body: '',
                launch: today,
                time: '',
                openSnack: true
            });
        } else if (res.data.success) location.pathname = '/';
    }
    async checkAuth(password) {
        const res = await axios({
            method: 'post',
            url: 'api/auth',
            data: { password }
        });
        if (res.data.success) this.setState({ authorized: true });
        else {
            const button = document.getElementById('hate-it');
            button.click();
        }
    }
    handleCheckBox() {
        this.setState({ addMore: !this.state.addMore });
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
    handleRequestClose() {
        this.setState({ openSnack: false });
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
        return (
            <div>
                <Header toggleDrawer={this.toggleDrawer} />
                {!this.state.authorized && <Protector check={this.checkAuth} />}
                {this.state.authorized && <div className="post-creator">
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
                        {/* <div>
                            <AutoComplete
                                hintText="Location"
                                dataSource={this.state.dataSource}
                                onUpdateInput={this.handleUpdateInput}
                                filter={AutoComplete.caseInsensitiveFilter}
                            />
                        </div> */}
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
                        backgroundColor="#4BC0EA"
                        labelColor="white"
                        onClick={this.onSubmit}
                    />
                    <CheckBox
                        label="Add More Posts"
                        labelStyle={{ color: 'gray' }}
                        onCheck={this.handleCheckBox}
                        style={{
                            position: 'absolute',
                            width: '57%',
                            right: '0px',
                            bottom: '60px'
                        }}
                    />
                </div>}
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
