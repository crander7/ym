import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import Icon from 'material-ui/svg-icons/navigation/close';

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

export default class SignUpForm extends Component {
    render() {
        const {
            onSubmit,
            onChange,
            errors,
            user,
            checkChange
        } = this.props;
        return (
            <div className="outer-form">
                <Card className="container inner-form">
                    <Link
                        to="/"
                        className="upper-x normalize-link"
                    >
                        <Icon />
                    </Link>
                    <div className="signup-head">
                        <span>Sign up with </span>
                        <a href="http://localhost:8086/auth/facebook" className="normalize-link link-color">
                            Facebook
                        </a>
                        <span> or </span>
                        <a href="http://localhost:8086/auth/google" className="normalize-link link-color">
                            Google
                        </a>
                    </div>
                    <div className="divider">
                        <div>
                            <span className="span-div">
                                <span>
                                    <span className="login-div">or</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <form action="/" onSubmit={onSubmit}>
                        {errors.summary && <p className="error-message">{errors.summary}</p>}
                        <div className="field-line">
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Name"
                                name="name"
                                errorText={errors.name}
                                onChange={onChange}
                                value={user.name}
                            />
                        </div>
                        <div className="field-line">
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Email"
                                name="email"
                                errorText={errors.email}
                                onChange={onChange}
                                value={user.email}
                            />
                        </div>
                        <div className="field-line">
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Password"
                                type="password"
                                name="password"
                                onChange={onChange}
                                errorText={errors.password}
                                value={user.password}
                            />
                        </div>
                        <DatePicker
                            value={user.birthday}
                            className="pointer field-line"
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
                            onChange={onChange}
                        />
                        <Checkbox
                            className="field-line mt20"
                            label="Request leader access"
                            checked={user.editor}
                            onCheck={checkChange}
                        />
                        <div className="button-line">
                            <button className="email-btn w">
                                <div>
                                    <span className="network">Sign up</span>
                                </div>
                            </button>
                        </div>
                        <hr className="separator" />
                        <CardText style={{ textAlign: 'center' }}>Already have an account? <Link className="normalize-link link-color" to={'/login'}>Log in</Link></CardText>
                    </form>
                </Card>
            </div>
        );
    }
}

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    checkChange: PropTypes.func.isRequired
};
