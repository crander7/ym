import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import History from 'material-ui/svg-icons/action/history';
import Popover from 'material-ui/Popover';
import Card from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Actions from 'material-ui/svg-icons/navigation/apps';
import Add from 'material-ui/svg-icons/content/add-circle';
import Filter from 'material-ui/svg-icons/content/filter-list';
import Home from 'material-ui/svg-icons/action/home';
import Clear from 'material-ui/svg-icons/content/clear';
import { Link } from 'react-router';
import axios from 'axios';
import Header from './../Header/Header';
import Protector from './../Protector/Protector';
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
            postIdx: null,
            authorized: false,
            filteredPosts: null,
            filtered: false,
            openPopover: false,
            popoverAnchor: null,
            actionsIdx: null,
            old: false,
            openSnack: false
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
        this.handleOldRequest = this.handleOldRequest.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: '/api/getUpcomingPosts'
        });
        const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        this.setState({ posts, filteredPosts: posts });
    }
    async checkAuth(password) {
        const res = await axios({
            method: 'post',
            url: 'api/auth',
            data: { password }
        });
        if (res.data.success) this.setState({ authorized: true });
        else {
            const button = document.getElementById('hate-it');
            button.click();
        }
    }
    async handleOldRequest() {
        if (this.state.old) {
            const res = await axios({
                method: 'get',
                url: '/api/getUpcomingPosts'
            });
            const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            this.setState({ posts, filteredPosts: posts, old: false });
        } else {
            const res = await axios({
                method: 'get',
                url: '/api/getArchivePosts'
            });
            const posts = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            this.setState({ posts, filteredPosts: posts, old: true });
        }
    }
    togglePopover(openPopover, popoverAnchor, actionsIdx) {
        this.setState({ openPopover, popoverAnchor, actionsIdx });
    }
    handleFilter(event) {
        const { posts } = this.state;
        let filterVal = event.target.innerHTML;
        const index = filterVal.indexOf('<');
        if (index !== -1) filterVal = filterVal.substring(5, filterVal.lastIndexOf('<'));
        const filteredPosts = posts.filter(post => post.activity === filterVal);
        this.setState({ filteredPosts, filtered: true });
    }
    toggleDrawer(open, anchorEl) {
        this.setState({ open, anchorEl });
    }
    handleOpen() {
        this.setState({ deleteCheck: true });
    }
    handleRequestClose() {
        this.setState({ open: false, openPopover: false, openSnack: false });
    }
    handleClose() {
        this.setState({ deleteCheck: false, postId: null, postIdx: null });
    }
    async handleDelete() {
        const { posts, postId, postIdx } = this.state;
        const res = await axios({
            method: 'delete',
            url: '/api/deletePost',
            data: { id: postId }
        });
        if (res.data.success) {
            posts.splice(postIdx, 1);
            this.setState({ posts, postId: null, postIdx: null, deleteCheck: false, openSnack: true });
        } else this.setState({ postId: null, postIdx: null, deleteCheck: false });
    }
    render() {
        const { filteredPosts } = this.state;
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
                {!this.state.authorized && <Protector check={this.checkAuth} />}
                {this.state.authorized && <h3 style={{ textAlign: 'center' }}>{this.state.old ? 'Past Posts' : 'Upcoming Posts'}</h3>}
                {this.state.authorized && <div className="posts-edit">
                    {filteredPosts && filteredPosts.map((post, idx) => (
                        <Card key={post.id} style={{ marginBottom: '10px', padding: '20px 10px' }}>
                            <div style={{ display: 'table-cell', width: '50vw' }}>
                                <div className="post-title">
                                    <span className="act-title">{post.activity}:</span>
                                    <span className="orig-title"> {post.title}</span>
                                </div>
                                <span>{formatTimestamp(post.start_date)}</span>
                                {post.party && <span> for {post.party}</span>}
                            </div>
                            <div className="actions">
                                <Actions
                                    style={{ height: '40px', width: '40px' }}
                                    onClick={e => this.togglePopover(!this.state.openPopover, e.currentTarget, post.id)}
                                />
                            </div>
                            <Popover
                                open={this.state.openPopover && post.id === this.state.actionsIdx}
                                anchorEl={this.state.popoverAnchor}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                onRequestClose={this.handleRequestClose}
                            >
                                <Menu>
                                    <Link
                                        to={`/postEditor/${post.id}`}
                                        className="normalize-link"
                                    >
                                        <MenuItem
                                            primaryText="Edit Post"
                                            leftIcon={<Edit />}
                                        />
                                    </Link>
                                    <MenuItem
                                        primaryText="Delete Post"
                                        onClick={() => this.setState({ openPopover: false, actionsIdx: null, postId: post.id, postIdx: idx, deleteCheck: true })}
                                        leftIcon={<Delete />}
                                    />
                                </Menu>
                            </Popover>
                        </Card>
                    ))}
                </div>}
                {this.state.authorized && <RaisedButton
                    onClick={this.handleOldRequest}
                    label="Toggle Old/Upcoming Posts"
                    backgroundColor="#EF3026"
                    labelColor="white"
                    style={{
                        width: '260px',
                        margin: '15px 50px'
                    }}
                />}
                <Drawer
                    className="home-drawer"
                    docked={false}
                    width={235}
                    open={this.state.open}
                    onRequestChange={open => this.setState({ open })}
                >
                    <List>
                        <Link
                            to="/"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Home" leftIcon={<Home />} />
                        </Link>
                        <Link
                            to="/addPost"
                            className="normalize-link"
                            onClick={this.handleRequestClose}
                        >
                            <ListItem primaryText="Add Post" leftIcon={<Add />} />
                        </Link>
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
                            onClick={() => { this.handleRequestClose(); this.setState({ filteredPosts: this.state.posts, filtered: false }); }}
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
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.deleteCheck}
                    onRequestClose={this.handleClose}
                >
                    Delete Post?
                </Dialog>
                <Snackbar
                    open={this.state.openSnack}
                    message="Post Successfully Deleted"
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}
