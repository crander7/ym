import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from './../Header/Header';
import './CheckinRes.scss';

export default class CheckinRes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            done: false,
            error: false,
            previous: false
        };
    }
    async componentWillMount() {
        const query = this.props.location.query;
        let url = '/api/userCheckin';
        if (query.child === 'true') url = '/api/childCheckin';
        const res = await axios({
            method: 'POST',
            url,
            data: { query }
        });
        if (res.data.success && res.data.first) this.setState({ done: true });
        else if (res.data.success && !res.data.first) this.setState({ done: true, previous: true });
        else this.setState({ error: true });
        setTimeout(() => {
            window.close();
        }, 1500);
    }
    render() {
        const { done, error, previous } = this.state;
        return (
            <div>
                <Header />
                <div className="checkin-parent">
                    {(done && !error && !previous) ?
                        <div className="checkin-text good">Check-in Success!</div> :
                        (done && previous && !error) ?
                            <div className="checkin-text">You were already checked-in</div> :
                            (error) ?
                                <div className="checkin-text error">There was an error checking in</div> :
                                <div className="checkin-text">Checking In ...</div>
                    }
                </div>
            </div>
        );
    }
}

CheckinRes.propTypes = {
    location: PropTypes.object.isRequired
};
