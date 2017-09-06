import React, { Component } from 'react';
import axios from 'axios';
import Drawer from 'material-ui/Drawer';
import { Link } from 'react-router';
import Add from 'material-ui/svg-icons/content/add-circle';
import Tool from 'material-ui/svg-icons/action/build';
import History from 'material-ui/svg-icons/action/history';
import Filter from 'material-ui/svg-icons/content/filter-list';
import Clear from 'material-ui/svg-icons/content/clear';
import Edit from 'material-ui/svg-icons/image/edit';
import { List, ListItem } from 'material-ui/List';
import Header from './../Header/Header';
import Posts from './../Posts/Posts';
import data from './../AddPost/data';
import './Home.css';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            open: false,
            filtered: false,
            anchorEl: null,
            filterPosts: null
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: '/api/getUpcomingPosts'
        });
        if (res.data[0]) {
            const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            this.setState({ posts, filterPosts: posts });
        } else this.setState({ posts: [], filterPosts: [] });
    }
    toggleDrawer(open, anchorEl) {
        this.setState({ open, anchorEl });
    }
    handleFilter(event) {
        const { posts } = this.state;
        let filterVal = event.target.innerHTML;
        const index = filterVal.indexOf('<');
        if (index !== -1) filterVal = filterVal.substring(5, filterVal.lastIndexOf('<'));
        const filterPosts = posts.filter(post => post.activity === filterVal);
        this.setState({ filterPosts, filtered: true });
    }
    handleRequestClose() {
        this.setState({ open: false });
    }
    render() {
        return (
            <div className="post-view">
                <Header toggleDrawer={this.toggleDrawer} />
                <h3>Upcoming Events</h3>
                <Posts posts={this.state.filterPosts} />
                <Drawer
                    className="home-drawer"
                    docked={false}
                    width={235}
                    open={this.state.open}
                    onRequestChange={open => this.setState({ open })}
                >
                    <List>
                        <ListItem
                            primaryText="Admin Tools"
                            primaryTogglesNestedList={true}
                            leftIcon={<Tool />}
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
                                        leftIcon={<Add />}
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
                                        leftIcon={<Edit />}
                                    />
                                </Link>
                            ]}
                        />
                        <ListItem
                            primaryText="Filter Posts"
                            primaryTogglesNestedList={true}
                            leftIcon={<Filter />}
                            nestedItems={data.types && data.types.map(type => (
                                <ListItem
                                    className="filter-list"
                                    primaryText={type}
                                    key={type}
                                    onClick={(e) => { this.handleRequestClose(); this.handleFilter(e); }}
                                />
                            ))}
                        />
                        <ListItem
                            primaryText="Clear Filter"
                            onClick={() => { this.handleRequestClose(); this.setState({ filterPosts: this.state.posts, filtered: false }); }}
                            leftIcon={<Clear />}
                            disabled={!this.state.filtered}
                        />
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
            </div>
        );
    }
}
