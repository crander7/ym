import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import './Header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }
    handleTouchTap(evt) {
        evt.preventDefault();
        this.props.toggleDrawer(true, evt.currentTarget);
    }
    handleRequestClose() {
        this.props.toggleDrawer(false, null);
    }
    render() {
        return (
            <div>
                <AppBar
                    className="header"
                    title={<Link to="/" className="normalize-link title">1st Ward Activities</Link>}
                    onLeftIconButtonTouchTap={e => this.handleTouchTap(e)}
                />
            </div>
        );
    }
}

Header.propTypes = {
    toggleDrawer: PropTypes.func.isRequired
};
