import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import axios from 'axios';
import Header from './../Header/Header';
import data from './../AddPost/data';
import './EditPosts.css';

const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
};

const formatTimestamp = (date) => {
    const start = new Date(date);
    return start.toLocaleDateString('en-US', options);
};

export default class EditPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            open: false,
            anchorEl: null,
            deleteCheck: false,
            postId: null,
            postIdx: null
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: '/api/getUpcomingPosts'
        });
        const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        this.setState({ posts });
    }
    toggleDrawer(open, anchorEl) {
        this.setState({ open, anchorEl });
    }
    handleOpen() {
        this.setState({ deleteCheck: true });
    }
    handleClose() {
        this.setState({ deleteCheck: false, postId: null, postIdx: null });
    }
    async handleDelete() {
        const { posts, postId, postIdx } = this.state;
        await axios({
            method: 'delete',
            url: '/api/deletePost',
            data: { id: postId }
        });
        posts.splice(postIdx, 1);
        this.setState({ posts, postId: null, postIdx: null, deleteCheck: false });
    }
    render() {
        const { posts } = this.state;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this.handleDelete}
            />
        ];
        return (
            <div>
                <Header toggleDrawer={this.toggleDrawer} />
                <div className="posts-main">
                    {posts && posts.map((post, idx) => (
                        <div key={post.id} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'inline-block', width: '50vw' }}>
                                <div className="post-title">
                                    <span className="act-title">{post.activity}:</span>
                                    <span className="orig-title"> {post.title}</span>
                                </div>
                                <span>{formatTimestamp(post.start_date)}</span>
                                {post.party && <span> for {post.party}</span>}
                            </div>
                            <RaisedButton
                                style={{ display: 'inline-block', position: 'relative', bottom: '50px', left: '40px', cursor: 'pointer' }}
                                onClick={() => this.setState({ postId: post.id, postIdx: idx, deleteCheck: true })}
                            >
                                Delete
                            </RaisedButton>
                        </div>
                    ))}
                </div>
                <Drawer
                    className="home-drawer"
                    docked={false}
                    width={235}
                    open={this.state.open}
                    onRequestChange={open => this.setState({ open })}
                >
                    <List>
                        <Link
                            to="/addpost"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Add New Post" />
                        </Link>
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
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.deleteCheck}
                    onRequestClose={this.handleClose}
                >
                    Delete Post?
                </Dialog>
            </div>
        );
    }
}
