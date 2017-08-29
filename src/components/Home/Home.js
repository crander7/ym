import React, { Component } from 'react';
import axios from 'axios';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Header from './../Header/Header';
import Posts from './components/Posts/Posts';
import data from './../AddPost/data';
import './Home.css';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            open: false,
            filterOpen: false,
            filtered: false,
            anchorEl: null,
            filterPosts: null
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleFilterOpen = this.handleFilterOpen.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: '/api/getUpcomingPosts'
        });
        const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        this.setState({ posts, filterPosts: posts });
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
    handleFilterOpen() {
        this.setState({ filterOpen: !this.state.filterOpen });
    }
    render() {
        return (
            <div className="post-view">
                <Header toggleDrawer={this.toggleDrawer} />
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
                            primaryText="Filter Posts"
                            primaryTogglesNestedList={true}
                            onClick={this.handleFilterOpen}
                            open={this.state.filterOpen}
                            nestedItems={data.types && data.types.map(type => (
                                <ListItem
                                    className="filter-list"
                                    primaryText={type}
                                    key={type}
                                    onClick={(e) => { this.handleRequestClose(); this.setState({ filterOpen: false }); this.handleFilter(e); }}
                                />
                            ))}
                        />
                        <ListItem
                            primaryText="Clear Filter"
                            onClick={() => { this.handleRequestClose(); this.setState({ filterOpen: false, filterPosts: this.state.posts, filtered: false }); }}
                            disabled={!this.state.filtered}
                        />
                    </List>
                </Drawer>
            </div>
        );
    }
}
