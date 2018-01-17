import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import Card from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Face from 'material-ui/svg-icons/action/face';
import Status from 'material-ui/svg-icons/action/verified-user';
import Up from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import Down from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import areIntlLocalesSupported from 'intl-locales-supported';
import Header from './../Header/Header';
import Drawer from './../Drawer/Drawer';
import Auth from './../../modules/auth';
import data from './reminderData';
import './Account.scss';

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 12);

let DateTimeFormat;

if (areIntlLocalesSupported(['fr', 'fa-IR'])) {
    DateTimeFormat = global.Intl.DateTimeFormat;
} else {
    const IntlPolyfill = require('intl'); // eslint-disable-line
    DateTimeFormat = IntlPolyfill.DateTimeFormat;
    require('intl/locale-data/jsonp/fr'); // eslint-disable-line
    require('intl/locale-data/jsonp/fa-IR'); // eslint-disable-line
}

const photoFormatter = url => `${url.substring(0, url.lastIndexOf('sz=') + 3)}200`;

const ageCheck = (age) => {
    const leaderMin = new Date();
    leaderMin.setFullYear(leaderMin.getFullYear() - 19);
    if (leaderMin.getFullYear() >= age.getFullYear()) return true;
    return false;
};

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                display_name: '',
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                alerts: '',
                alert_days: '',
                alert_hour: '',
                birthday: new Date(),
                account: '',
                edit_req: false
            },
            errors: null,
            openPersonal: false,
            openDrawer: false,
            openAlerts: false,
            openDialog: false,
            dialogTitle: '',
            dialogMsg: '',
            changed: false,
            phoneErr: false,
            tempPhone: ''
        };
        this.modalPhone = this.modalPhone.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleProfileSave = this.handleProfileSave.bind(this);
        this.handleExpandDetail = this.handleExpandDetail.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'GET',
            url: '/api/getUser',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        } else {
            if (res.data) {
                if (res.data.g_photo) res.data.g_photo = photoFormatter(res.data.g_photo);
                if (res.data.birthday) res.data.birthday = new Date(res.data.birthday);
            }
            if (res.data && !res.data.alerts && !res.data.birthday) {
                this.setState({
                    user: { ...res.data },
                    openDialog: true,
                    dialogTitle: 'Attention',
                    dialogMsg: 'Please take a moment to update your profile, birthday is especailly important. Many features rely on that value.'
                });
            } else if (res.data && !res.data.alerts) {
                this.setState({
                    user: { ...res.data },
                    openDialog: true,
                    dialogTitle: 'Attention',
                    dialogMsg: 'Please take a moment to update your notification preferences.'
                });
            } else if (res.data && !res.data.birthday) {
                this.setState({
                    user: { ...res.data },
                    openDialog: true,
                    dialogTitle: 'Attention',
                    dialogMsg: 'Please take a moment to add your birthday to your profile.'
                });
            } else if (res.data) {
                this.setState({
                    user: { ...res.data }
                });
            }
        }
    }
    handleCheckboxClick(e, checked) {
        const { user } = this.state;
        user.edit_req = checked;
        this.setState({ user, changed: true });
    }
    async handleProfileSave() {
        const res = await axios({
            method: 'PUT',
            url: '/api/updateUser',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: { ...this.state.user }
        });
        if (res.data.success) {
            this.setState({
                openDialog: true,
                dialogMsg: 'You\'re changes have been saved',
                dialogTitle: 'Success',
                changed: false
            });
        } else if (res.data.error) {
            this.setState({
                openDialog: true,
                dialogTitle: 'Error',
                dialogMsg: 'There was an error saving your data. Try again later.'
            });
        } else if (res.data) {
            this.setState({
                errors: res.data.errors
            });
        }
    }
    changeUser(event, val) {
        const { user } = this.state;
        let error;
        if (event) {
            if (event.target.name) {
                const field = event.target.name;
                const value = event.target.value;
                if (field === 'alerts' && value === 'text') {
                    if (!user.phone) {
                        error = true;
                        this.setState({
                            phoneErr: true,
                            openDialog: true,
                            dialogTitle: 'Error',
                            dialogMsg: 'You must first add a phone number to receive text notifications.'
                        });
                    } else user[field] = value;
                } else user[field] = value;
            } else {
                const field = event.currentTarget.getAttribute('name');
                user[field] = val;
            }
        }
        if (!event) user.birthday = val;
        if (!error) {
            this.setState({
                user,
                changed: true
            });
        }
    }
    modalPhone(event, val) {
        if (typeof val === 'string') {
            const value = event.target.value;
            this.setState({
                tempPhone: value
            });
        } else if (typeof val === 'object') {
            let { tempPhone } = this.state;
            tempPhone = tempPhone.replace(/[-,\s,(,)]/g, '');
            if (tempPhone.length === 10 || tempPhone.length === 11) {
                const { user } = this.state;
                user.phone = tempPhone;
                user.alerts = 'text';
                this.setState({
                    user,
                    changed: true,
                    phoneErr: false,
                    openDialog: false,
                    dialogMsg: '',
                    dialogTitle: ''
                });
            } else {
                this.setState({
                    tempPhone: '',
                    dialogMsg: 'Invalid phone number. Must include area code.'
                });
            }
        }
    }
    handleExpandDetail(evt) {
        const val = evt.currentTarget.getAttribute('name');
        if (val === 'personal') {
            this.setState({
                openPersonal: !this.state.openPersonal
            });
        } else if (val === 'alerts') {
            this.setState({
                openAlerts: !this.state.openAlerts
            });
        }
    }
    toggleDrawer(openDrawer) {
        this.setState({
            openDrawer
        });
    }
    handleModalClose() {
        this.setState({
            openDialog: false,
            dialogMsg: '',
            dialogTitle: ''
        });
    }
    render() {
        const { user } = this.state;
        const actions = [
            <FlatButton
                label="Okay"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleModalClose}
            />
        ];
        const phoneActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleModalClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.modalPhone}
            />
        ];
        return (
            <div>
                <Header
                    toggleDrawer={this.toggleDrawer}
                />
                {user && <div>
                    {user.g_photo || user.fb_photo ? <img
                        src={user.g_photo || user.fb_photo}
                        alt="pic"
                        className="profile-pic"
                    /> : <Face className="generic-pic" />}
                    <h2 className="profile-name">{user.display_name}</h2>
                </div>}
                {user && user.account && user.account !== 'user' &&
                    <div className="status-cont">
                        <Status style={{ fill: '#52B852' }} />
                        <span className="status">Verified Leader</span>
                    </div>
                }
                {user &&
                <div
                    className="form-cont"
                >
                    <div
                        onClick={this.handleExpandDetail}
                        role="button"
                        name="personal"
                        tabIndex={0}
                        className="center edit-group"
                    >
                        <span>Personal Info</span>
                        {this.state.openPersonal ? <Up className="caret" /> : <Down className="caret" />}
                    </div>
                    <Card className={this.state.openPersonal ? 'show' : 'hide'}>
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Display Name"
                            errorText={this.state.errors && this.state.errors.display_name}
                            name="display_name"
                            onChange={this.changeUser}
                            value={user.display_name ? user.display_name : ''}
                        />
                        <TextField
                            fullWidth={true}
                            floatingLabelText="First Name"
                            errorText={this.state.errors && this.state.errors.first_name}
                            name="first_name"
                            onChange={this.changeUser}
                            value={user.first_name ? user.first_name : ''}
                        />
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Last Name"
                            errorText={this.state.errors && this.state.errors.last_name}
                            name="last_name"
                            onChange={this.changeUser}
                            value={user.last_name ? user.last_name : ''}
                        />
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Phone Number"
                            errorText={this.state.errors && this.state.errors.phone}
                            name="phone"
                            onChange={this.changeUser}
                            value={user.phone ? user.phone : ''}
                        />
                        <TextField
                            fullWidth={true}
                            floatingLabelText="Email"
                            errorText={this.state.errors && this.state.errors.email}
                            disabled={true}
                            name="email"
                            onChange={this.changeUser}
                            value={user.email ? user.email : ''}
                        />
                        <DatePicker
                            value={user.birthday ? user.birthday : maxDate}
                            className="pointer"
                            floatingLabelText="Birthday"
                            firstDayOfWeek={0}
                            name="birthday"
                            openToYearSelection={true}
                            fullWidth={true}
                            maxDate={maxDate}
                            formatDate={new DateTimeFormat('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }).format}
                            onChange={this.changeUser}
                        />
                    </Card>
                </div>}
                {user &&
                    <div className="form-cont">
                        <div
                            onClick={this.handleExpandDetail}
                            role="button"
                            name="alerts"
                            tabIndex={0}
                            className="center edit-group"
                        >
                            <span>Notification Preferences</span>
                            {this.state.openAlerts ? <Up className="caret" /> : <Down className="caret" />}
                        </div>
                        <Card className={this.state.openAlerts ? 'show' : 'hide'}>
                            <div className="center not-desc">
                                <span>Please select a notification method</span>
                            </div>
                            <RadioButtonGroup
                                name="alerts"
                                onChange={this.changeUser}
                                valueSelected={user.alerts ? user.alerts : null}
                            >
                                <RadioButton
                                    label="No notifications"
                                    value="none"
                                />
                                <RadioButton
                                    label="Email"
                                    value="email"
                                />
                                <RadioButton
                                    id="text-alert"
                                    label="Text"
                                    value="text"
                                />
                            </RadioButtonGroup>
                            <SelectField
                                hintText="Time of notification"
                                value={user.alert_hour}
                                name="alert_hour"
                                disabled={!user.alerts}
                                maxHeight={300}
                            >
                                {data.hours.map(hour => (
                                    <MenuItem
                                        key={hour[0]}
                                        value={hour[0]}
                                        primaryText={hour[1]}
                                        name="alert_hour"
                                        onClick={e => this.changeUser(e, hour[0])}
                                    />
                                ))}
                            </SelectField>
                            <SelectField
                                hintText="# of days before activity"
                                value={user.alert_days}
                                disabled={!user.alerts}
                                name="alert_days"
                            >
                                {data.days.map(day => (
                                    <MenuItem
                                        key={day[0]}
                                        value={day[0]}
                                        primaryText={day[1]}
                                        name="alert_days"
                                        onClick={e => this.changeUser(e, day[0])}
                                    />
                                ))}
                            </SelectField>
                        </Card>
                    </div>
                }
                {user && user.account === 'user' && user.birthday && ageCheck(user.birthday) && <Checkbox
                    className="edit mt20"
                    label="Request leader access"
                    checked={user.edit_req}
                    onCheck={this.handleCheckboxClick}
                />}
                {this.state.changed && <RaisedButton
                    label="Save Changes"
                    className="save-profile"
                    onClick={this.handleProfileSave}
                />}
                <Drawer
                    user={this.props.route.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
                <Dialog
                    title={this.state.dialogTitle}
                    open={this.state.openDialog}
                    modal={false}
                    actions={this.state.phoneErr ? phoneActions : actions}
                    onRequestClose={this.handleModalClose}
                >
                    {this.state.dialogMsg}
                    {this.state.phoneErr &&
                        <TextField
                            floatingLabelText="Phone Number"
                            name="phone"
                            type="tel"
                            value={this.state.tempPhone ? this.state.tempPhone : ''}
                            onChange={this.modalPhone}
                        />
                    }
                </Dialog>
            </div>
        );
    }
}

Account.propTypes = {
    route: PropTypes.object.isRequired
};
