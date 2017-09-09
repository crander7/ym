import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class SignUpForm extends Component {
    render() {
        const {
            onSubmit,
            onChange,
            errors,
            user
        } = this.props;
        return (
            <Card className="container">
                <form action="/" onSubmit={onSubmit}>
                    <h2 className="card-heading">Sign Up</h2>
                    {errors.summary && <p className="error-message">{errors.summary}</p>}
                    <div className="field-line">
                        <TextField
                            floatingLabelText="Name"
                            name="name"
                            errorText={errors.name}
                            onChange={onChange}
                            value={user.name}
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="Email"
                            name="email"
                            errorText={errors.email}
                            onChange={onChange}
                            value={user.email}
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="Password"
                            type="password"
                            name="password"
                            onChange={onChange}
                            errorText={errors.password}
                            value={user.password}
                        />
                    </div>
                    <div className="button-line">
                        <RaisedButton type="submit" label="Create New Account" primary />
                    </div>
                    <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
                </form>
            </Card>
        );
    }
}

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
