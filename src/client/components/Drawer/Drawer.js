import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MDrawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Add from 'material-ui/svg-icons/content/add-circle';
import Tool from 'material-ui/svg-icons/action/build';
import History from 'material-ui/svg-icons/action/history';
import Upcoming from 'material-ui/svg-icons/social/whatshot';
import Account from 'material-ui/svg-icons/action/account-circle';
import HomeIcon from 'material-ui/svg-icons/action/home';
import Filter from 'material-ui/svg-icons/content/filter-list';
import Admin from 'material-ui/svg-icons/action/settings';
import Clear from 'material-ui/svg-icons/content/clear';
import Edit from 'material-ui/svg-icons/image/edit';
import data from './../AddPost/data';
import Login from './../LoginPage/LoginPage';
import SignUp from './../SignUpPage/SignUpPage';
import './Drawer.scss';

export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            openLogin: false,
            openSignup: false,
            filtered: false,
            user: null
        };
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleAuthClick = this.handleAuthClick.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }
    componentWillMount() {
        this.setState({ user: this.props.user });
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
            } else if (!this.state.user) this.setState({ openLogin: true });
            else location.pathname = '/logout';
        } else if (val) {
            this.setState({ openSignup: false });
        } else if (!this.state.user) this.setState({ openSignup: true });
        else location.pathname = '/logout';
    }
    handleFilter(event) { //eslint-disable-line
        let group = false;
        if (event.currentTarget.className === 'group-filter filter-list') group = true;
        let filterVal = event.target.innerHTML;
        const index = filterVal.indexOf('<');
        if (index !== -1) filterVal = filterVal.substring(5, filterVal.lastIndexOf('<'));
        this.setState({ filtered: true });
        if (group) this.props.handleGroupFilter(filterVal);
        else this.props.handleFilterVal(filterVal);
    }
    render() {
        const { user } = this.state;
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
                        {user && <Link
                            to="/account"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Profile"
                                rightIcon={<Account />}
                            />
                        </Link>}
                        {(this.props.page === 'home' || this.props.page === 'past') && <ListItem
                            primaryText="Filter By"
                            primaryTogglesNestedList={true}
                            rightIcon={<Filter />}
                            nestedItems={
                                [
                                    <ListItem
                                        primaryText="Activity Type"
                                        primaryTogglesNestedList={true}
                                        key={0}
                                        nestedItems={data.types && data.types.map(type => (
                                            <ListItem
                                                className="filter-list"
                                                primaryText={type}
                                                key={type}
                                                onClick={this.handleFilter}
                                            />
                                        ))}
                                    />,
                                    <ListItem
                                        primaryText="Quorum/Class"
                                        primaryTogglesNestedList={true}
                                        key={1}
                                        nestedItems={data.groups && data.groups.map(group => (
                                            <ListItem
                                                className="group-filter filter-list"
                                                primaryText={group}
                                                key={group}
                                                onClick={this.handleFilter}
                                            />
                                        ))}
                                    />
                                ]
                            }
                        />}
                        {(this.props.page === 'home' || this.props.page === 'past') && <ListItem
                            primaryText="Clear Filter(s)"
                            onClick={this.props.resetFilter}
                            rightIcon={<Clear />}
                            disabled={!this.state.filtered}
                            className={!this.state.filtered ? 'disabled' : ''}
                        />}
                        {this.props.page !== 'past' && <Link
                            to="/pastActivities"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Past Posts"
                                rightIcon={<History />}
                            />
                        </Link>}
                        {this.props.page !== 'home' && <Link
                            to="/"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem
                                primaryText="Upcoming Activities"
                                rightIcon={<Upcoming />}
                            />
                        </Link>}
                        <hr className="nav-hr" />
                        {user && (user.acct === 'admin' || user.acct === 'editor') && <ListItem
                            primaryText="Leader Tools"
                            primaryTogglesNestedList={true}
                            rightIcon={<Tool />}
                            nestedItems={user && user.acct === 'admin' ? [
                                <Link
                                    to="/addPost"
                                    className="normalize-link"
                                    onClick={this.handleRequestClose}
                                    key={0}
                                >
                                    <ListItem
                                        primaryText="Add Posts"
                                        className="pl-15"
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
                                        className="pl-15"
                                        rightIcon={<Edit />}
                                    />
                                </Link>,
                                <Link
                                    to="/admin"
                                    key={2}
                                    onClick={this.handleRequestClose}
                                    className="normalize-link"
                                >
                                    <ListItem
                                        primaryText="Admin"
                                        className="pl-15"
                                        rightIcon={<Admin />}
                                    />
                                </Link>
                            ] : [
                                <Link
                                    to="/addPost"
                                    className="normalize-link"
                                    onClick={this.handleRequestClose}
                                    key={0}
                                >
                                    <ListItem
                                        primaryText="Add Posts"
                                        className="pl-15"
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
                                        className="pl-15"
                                        rightIcon={<Edit />}
                                    />
                                </Link>
                            ]}
                        />}
                        <ListItem
                            primaryText={this.state.user ? 'Log out' : 'Log in'}
                            onClick={e => this.handleAuthClick(e, null, 'login')}
                        />
                        {!this.state.user && <ListItem
                            primaryText="Sign up"
                            onClick={e => this.handleAuthClick(e, null, 'signup')}
                        />}
                    </List>
                </MDrawer>
                {this.state.openLogin && <Login closeLogin={this.handleAuthClick} />}
                {this.state.openSignup && <SignUp landing={true} closeLogin={this.handleAuthClick} />}
            </div>
        );
    }
}

Drawer.defaultProps = {
    user: null,
    handleFilterVal: null,
    handleGroupFilter: null,
    filtered: false,
    resetFilter: null,
    page: null
};

Drawer.propTypes = {
    user: PropTypes.object,
    openDrawer: PropTypes.bool.isRequired,
    handleFilterVal: PropTypes.func,
    handleGroupFilter: PropTypes.func,
    toggleDrawer: PropTypes.func.isRequired,
    filtered: PropTypes.bool,
    resetFilter: PropTypes.func,
    page: PropTypes.string
};
