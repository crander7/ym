import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
// import Drawer from 'material-ui/Drawer';
// import { Link } from 'react-router';
// import Add from 'material-ui/svg-icons/content/add-circle';
// import Tool from 'material-ui/svg-icons/action/build';
// import History from 'material-ui/svg-icons/action/history';
// import HomeIcon from 'material-ui/svg-icons/action/home';
// import Filter from 'material-ui/svg-icons/content/filter-list';
// import Clear from 'material-ui/svg-icons/content/clear';
// import Edit from 'material-ui/svg-icons/image/edit';
// import { List, ListItem } from 'material-ui/List';
import Header from './../Header/Header';
import Posts from './../Posts/Posts';
// import Login from './../LoginPage/LoginPage';
// import SignUp from './../SignUpPage/SignUpPage';
// import data from './../AddPost/data';
import Drawer from './../Drawer/Drawer';
import Auth from './../../modules/auth';
import './Home.css';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            openDrawer: false,
            filtered: false,
            filterPosts: null,
            filterVal: '',
            resetFilter: false
            // openLogin: false,
            // openSignup: false
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleFilterVal = this.handleFilterVal.bind(this);
        this.handleFilterReset = this.handleFilterReset.bind(this);
        // this.handleRequestClose = this.handleRequestClose.bind(this);
        // this.handleAuthClick = this.handleAuthClick.bind(this);
        // this.handleLdsClick = this.handleLdsClick.bind(this);
    }
    // async componentWillMount() {
    //     const res = await axios({
    //         method: 'get',
    //         url: '/api/getUpcomingPosts'
    //     });
    //     if (res.data[0]) {
    //         const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    //         this.setState({ posts, filterPosts: posts });
    //     } else this.setState({ posts: [], filterPosts: [] });
    // }
    // async componentWillMount() {
    //     const res = await axios({
    //         method: 'get',
    //         url: '/api/getArchivePosts'
    //     });
    //     if (res.data[0]) {
    //         const posts = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    //         this.setState({ posts, filterPosts: posts });
    //     } else this.setState({ posts: [], filterPosts: [] });
    // }
    // handleAuthClick(evt, val, loc) {
    //     if (loc === 'login') {
    //         if (val) {
    //             this.setState({ openLogin: false });
    //         } else if (!this.props.route.getUser()) this.setState({ openLogin: true });
    //         else location.pathname = '/logout';
    //     } else if (val) {
    //         this.setState({ openSignup: false });
    //     } else if (!this.props.route.getUser()) this.setState({ openSignup: true });
    //     else location.pathname = '/logout';
    // }
    // async handleLdsClick() {
    //     const res = await axios({
    //         method: 'GET',
    //         url: '/auth/lds'
    //     });
    //     const { openLogin } = this.state;
    //     console.log(res, openLogin);
    //     // let res = null;
    //     // try {
    //     //     res = await axios({
    //     //         method: 'POST',
    //     //         url: 'https://signin.lds.org/login.html',
    //     //         data: `username=${USERNAME}&password=${PASSWORD}`,
    //     //         headers: {
    //     //             'Access-Control-Allow-Origin': '*',
    //     //             'Content-Type': 'application/x-www-form-urlencoded'
    //     //         }
    //     //     });
    //     // } catch (e) {
    //     //     console.log('fail', e);
    //     // }
    // }
    handleFilterVal(filterVal) {
        this.setState({ filterVal, openDrawer: false, resetFilter: false, filtered: true });
    }
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    handleFilterReset() {
        this.setState({ resetFilter: true, filtered: false, openDrawer: false });
    }
    // handleFilter(event) {
    //     const { posts } = this.state;
    //     let filterVal = event.target.innerHTML;
    //     const index = filterVal.indexOf('<');
    //     if (index !== -1) filterVal = filterVal.substring(5, filterVal.lastIndexOf('<'));
    //     const filterPosts = posts.filter(post => post.activity === filterVal);
    //     this.setState({ filterPosts, filtered: true, openDrawer: false });
    // }
    // handleRequestClose() {
    //     this.setState({ openDrawer: false });
    // }
    render() {
        return (
            <div className="post-view">
                <Header toggleDrawer={this.toggleDrawer} />
                <h3>Upcoming Events</h3>
                <Posts
                    origin="upcoming"
                    filterVal={this.state.filterVal}
                    resetFilter={this.state.resetFilter}
                />
                <Drawer
                    user={Auth.isUserAuthenticated}
                    openDrawer={this.state.openDrawer}
                    getUser={this.props.route.getUser}
                    handleFilterVal={this.handleFilterVal}
                    toggleDrawer={this.toggleDrawer}
                    filtered={this.state.filtered}
                    resetFilter={this.handleFilterReset}
                />
                {/* <Drawer
                    className="home-drawer"
                    docked={false}
                    width={235}
                    open={this.state.openDrawer}
                    onRequestChange={openDrawer => this.setState({ openDrawer })}
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
                            onClick={() => { this.handleRequestClose(); this.setState({ filterPosts: this.state.posts, filtered: false }); }}
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
                            primaryText={this.props.route.getUser() ? 'Log out' : 'Log in'}
                            onClick={e => this.handleAuthClick(e, null, 'login')}
                        />
                        {!this.props.route.getUser() && <ListItem
                            primaryText="Sign up"
                            onClick={e => this.handleAuthClick(e, null, 'signup')}
                        />}
                    </List>
                </Drawer>
                {this.state.openLogin && <Login closeLogin={this.handleAuthClick} ldsCheck={this.handleLdsClick} />}
                {this.state.openSignup && <SignUp landing={true} closeLogin={this.handleAuthClick} ldsCheck={this.handleLdsClick} />} */}
            </div>
        );
    }
}

Home.propTypes = {
    route: PropTypes.object.isRequired
};
