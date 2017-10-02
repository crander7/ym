import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MDrawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Add from 'material-ui/svg-icons/content/add-circle';
import Tool from 'material-ui/svg-icons/action/build';
import History from 'material-ui/svg-icons/action/history';
import HomeIcon from 'material-ui/svg-icons/action/home';
import Filter from 'material-ui/svg-icons/content/filter-list';
import Clear from 'material-ui/svg-icons/content/clear';
import Edit from 'material-ui/svg-icons/image/edit';
import data from './../AddPost/data';
import Login from './../LoginPage/LoginPage';
import SignUp from './../SignUpPage/SignUpPage';
// import axios from 'axios';
// import Auth from './../../modules/auth';

export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            openLogin: false,
            openSignup: false,
            filtered: false
        };
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleAuthClick = this.handleAuthClick.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const updateObj = {};
        if (nextProps.openDrawer && nextProps.openDrawer !== this.state.openDrawer) {
            updateObj.openDrawer = true; this.setState({ openDrawer: true });
        } else if (!nextProps.openDrawer && nextProps.openDrawer !== this.state.openDrawer) {
            updateObj.openDrawer = false; this.setState({ openDrawer: false });
        }
        if (nextProps.filtered && nextProps.filtered !== this.state.filtered) {
            updateObj.filtered = true;
        } else if (!nextProps.filtered && nextProps.filtered !== this.state.filtered) {
            updateObj.filtered = false;
        }
        this.setState({ ...updateObj });
    }
    handleRequestClose() {
        this.setState({ openDrawer: false });
    }
    handleAuthClick(evt, val, loc) {
        if (loc === 'login') {
            if (val) {
                this.setState({ openLogin: false });
            } else if (!this.props.getUser()) this.setState({ openLogin: true });
            else location.pathname = '/logout';
        } else if (val) {
            this.setState({ openSignup: false });
        } else if (!this.props.getUser()) this.setState({ openSignup: true });
        else location.pathname = '/logout';
    }
    handleFilter(event) {
        let filterVal = event.target.innerHTML;
        const index = filterVal.indexOf('<');
        if (index !== -1) filterVal = filterVal.substring(5, filterVal.lastIndexOf('<'));
        this.setState({ filtered: true });
        this.props.handleFilterVal(filterVal);
    }
    render() {
        return (
            <div>
                <MDrawer
                    className="home-drawer"
                    docked={false}
                    width={235}
                    open={this.state.openDrawer}
                    onRequestChange={openDrawer => this.props.toggleDrawer(openDrawer)}
                >
                    <List>
                        <Link
                            to="/"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Home"
                                rightIcon={<HomeIcon />}
                            />
                        </Link>
                        <hr className="nav-hr" />
                        <ListItem
                            primaryText="Leader Tools"
                            primaryTogglesNestedList={true}
                            rightIcon={<Tool />}
                            nestedItems={[
                                <Link
                                    to="/addPost"
                                    className="normalize-link"
                                    onClick={this.handleRequestClose}
                                    key={0}
                                >
                                    <ListItem
                                        primaryText="Add Posts"
                                        style={{ paddingLeft: '16px' }}
                                        rightIcon={<Add />}
                                    />
                                </Link>,
                                <Link
                                    to="/editPosts"
                                    className="normalize-link"
                                    onClick={this.handleRequestClose}
                                    key={1}
                                >
                                    <ListItem
                                        primaryText="Edit Posts"
                                        style={{ paddingLeft: '16px' }}
                                        rightIcon={<Edit />}
                                    />
                                </Link>
                            ]}
                        />
                        <ListItem
                            primaryText="Filter Posts"
                            primaryTogglesNestedList={true}
                            rightIcon={<Filter />}
                            nestedItems={data.types && data.types.map(type => (
                                <ListItem
                                    className="filter-list"
                                    primaryText={type}
                                    key={type}
                                    onClick={this.handleFilter}
                                />
                            ))}
                        />
                        <ListItem
                            primaryText="Clear Filter"
                            onClick={this.props.resetFilter}
                            rightIcon={<Clear />}
                            disabled={!this.state.filtered}
                            className={!this.state.filtered ? 'disabled' : ''}
                        />
                        <Link
                            to="/pastActivities"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Past Posts"
                                rightIcon={<History />}
                            />
                        </Link>
                        <hr className="nav-hr" />
                        <ListItem
                            primaryText={this.props.getUser() ? 'Log out' : 'Log in'}
                            onClick={e => this.handleAuthClick(e, null, 'login')}
                        />
                        {!this.props.getUser() && <ListItem
                            primaryText="Sign up"
                            onClick={e => this.handleAuthClick(e, null, 'signup')}
                        />}
                    </List>
                </MDrawer>
                {this.state.openLogin && <Login closeLogin={this.handleAuthClick} ldsCheck={this.handleLdsClick} />}
                {this.state.openSignup && <SignUp landing={true} closeLogin={this.handleAuthClick} ldsCheck={this.handleLdsClick} />}
            </div>
        );
    }
}

Drawer.propTypes = {
    openDrawer: PropTypes.bool.isRequired,
    getUser: PropTypes.func.isRequired,
    handleFilterVal: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    filtered: PropTypes.bool.isRequired,
    resetFilter: PropTypes.func.isRequired
};
