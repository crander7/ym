import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Card from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Actions from 'material-ui/svg-icons/navigation/apps';
import { Link } from 'react-router';
import axios from 'axios';
import Drawer from './../Drawer/Drawer';
import Header from './../Header/Header';
import Auth from './../../modules/auth';
import './EditPosts.scss';

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
            openDrawer: false,
            anchorEl: null,
            deleteCheck: false,
            postId: null,
            postIdx: null,
            filteredPosts: null,
            filtered: false,
            openPopover: false,
            popoverAnchor: null,
            actionsIdx: null,
            old: false,
            openSnack: false,
            openDialog: false
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
        this.handleOldRequest = this.handleOldRequest.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'get',
            url: '/api/getUpcomingPosts',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data) {
            const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            this.setState({ posts, filteredPosts: posts });
        } else if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        } else if (res.data.error) {
            this.setState({ openDialog: true });
        }
    }
    async handleOldRequest() {
        if (this.state.old) {
            const res = await axios({
                method: 'get',
                url: '/api/getUpcomingPosts',
                headers: { Authorization: `bearer ${Auth.getToken()}` }
            });
            const posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            this.setState({ posts, filteredPosts: posts, old: false });
        } else {
            const res = await axios({
                method: 'get',
                url: '/api/getArchivePosts',
                headers: { Authorization: `bearer ${Auth.getToken()}` }
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
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    handleOpen() {
        this.setState({ deleteCheck: true });
    }
    handleRequestClose() {
        this.setState({ open: false, openPopover: false, openSnack: false });
    }
    handleClose() {
        this.setState({ deleteCheck: false, postId: null, postIdx: null, openDialog: false });
    }
    async handleDelete() {
        const { posts, postId, postIdx } = this.state;
        const res = await axios({
            method: 'delete',
            url: '/api/deletePost',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: { id: postId }
        });
        if (res.data.success) {
            posts.splice(postIdx, 1);
            this.setState({ posts, postId: null, postIdx: null, deleteCheck: false, openSnack: true });
        } else this.setState({ postId: null, postIdx: null, deleteCheck: false, openDialog: true });
    }
    render() {
        const { filteredPosts } = this.state;
        const actions = [
            <FlatButton
                aria-label="Cancel"
                label="Cancel"
                secondary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                aria-label="Delete"
                label="Delete"
                primary={true}
                onClick={this.handleDelete}
            />
        ];
        const errActions = [
            <FlatButton
                label="Okay"
                primary={true}
                onTouchTap={this.handleRequestClose}
            />
        ];
        return (
            <div>
                <Header
                    toggleDrawer={this.toggleDrawer}
                />
                <h3 style={{ textAlign: 'center' }}>{this.state.old ? 'Past Posts' : 'Upcoming Posts'}</h3>
                <RaisedButton
                    onClick={this.handleOldRequest}
                    aria-label="Toggle Posts"
                    label={this.state.old ? 'Toggle Upcoming' : 'Toggle Past'}
                    backgroundColor="#E74C3C"
                    labelColor="#ffffff"
                    style={{
                        width: '260px',
                        margin: '0 auto',
                        display: 'block'
                    }}
                />
                <div className="posts-edit">
                    {filteredPosts && filteredPosts.map((post, idx) => (
                        <div key={post.id} className="post-edit-cont">
                            <div className="actions">
                                <Actions
                                    style={{ height: '40px', width: '40px' }}
                                    onClick={e => this.togglePopover(!this.state.openPopover, e.currentTarget, post.id)}
                                />
                            </div>
                            <Card style={{ marginBottom: '10px', padding: '20px 10px' }}>
                                <div style={{ display: 'table-cell', width: '50vw' }}>
                                    <div className="post-title">
                                        <span className="act-title">{post.activity}:</span>
                                        <span className="orig-title"> {post.title}</span>
                                    </div>
                                    <span style={{ display: 'block', marginTop: '15px' }}>{formatTimestamp(post.start_date)}</span>
                                    {post.groups && <span style={{ marginTop: '15px', display: 'block' }}> for {post.groups.map(group => ` ${group} `)}</span>}
                                </div>
                                <Popover
                                    open={this.state.openPopover && post.id === this.state.actionsIdx}
                                    anchorEl={this.state.popoverAnchor}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
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
                        </div>
                    ))}
                </div>
                <Drawer
                    user={this.props.route.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
                <Dialog
                    actions={this.state.openDialog ? errActions : actions}
                    modal={false}
                    title={this.state.openDialog ? 'Error' : ''}
                    open={this.state.deleteCheck || this.state.openDialog}
                    onRequestClose={this.handleClose}
                >
                    {this.state.openDialog ? 'An error occured with your request.' : 'Delete Post?'}
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

EditPosts.propTypes = {
    route: PropTypes.object.isRequired
};
