import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import Card from 'material-ui/Card';
// import Chip from 'material-ui/Chip';
// import Tag from 'material-ui/svg-icons/action/label-outline';
import './Posts.scss';

// const options = {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric'
// };

// const formatTimestamp = (date) => {
//     const start = new Date(date);
//     return start.toLocaleDateString('en-US', options);
// };

const getDay = (date) => {
    const start = new Date(date);
    let day = start.getDay();
    switch (day) {
    case 0:
        day = 'Sun';
        break;
    case 1:
        day = 'Mon';
        break;
    case 2:
        day = 'Tues';
        break;
    case 3:
        day = 'Wed';
        break;
    case 4:
        day = 'Thurs';
        break;
    case 5:
        day = 'Fri';
        break;
    case 6:
        day = 'Sat';
        break;
    default:
        day = 'Wed';
    }
    return day;
};

const getMonth = (date) => {
    const start = new Date(date);
    let month = start.getMonth();
    switch (month) {
    case 0:
        month = 'Jan';
        break;
    case 1:
        month = 'Feb';
        break;
    case 2:
        month = 'Mar';
        break;
    case 3:
        month = 'Apr';
        break;
    case 4:
        month = 'May';
        break;
    case 5:
        month = 'Jun';
        break;
    case 6:
        month = 'Jul';
        break;
    case 7:
        month = 'Aug';
        break;
    case 8:
        month = 'Sep';
        break;
    case 9:
        month = 'Oct';
        break;
    case 10:
        month = 'Nov';
        break;
    case 11:
        month = 'Dec';
        break;
    default:
        month = '';
    }
    return month;
};

export default class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDesc: false,
            descId: null,
            posts: null,
            filterPosts: null,
            filterVal: '',
            filterValGroup: '',
            resetFilter: false
            // toggleRefresh: false
        };
        this.handlePostClick = this.handlePostClick.bind(this);
        this.filterPosts = this.filterPosts.bind(this);
        // this.handleChipDelete = this.handleChipDelete.bind(this);
    }
    async componentWillMount() {
        let posts = [];
        let url = '/api/getUpcomingPosts';
        const origin = this.props.origin;
        if (origin === 'old') url = '/api/getArchivePosts';
        const res = await axios({
            method: 'GET',
            url
        });
        if (res.data[0]) {
            if (origin === 'upcoming') posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            else if (origin === 'old') posts = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            this.setState({ posts, filterPosts: posts });
        } else if (res.data.error) {
            this.props.openError();
            this.setState({ posts: [], filterPosts: [] });
        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.filterVal !== '' && nextProps.filterVal !== this.state.filterVal) {
            this.filterPosts(nextProps.filterVal);
        }
        if (nextProps.filterValGroup !== '' && (nextProps.filterValGroup !== this.state.filterValGroup)) {
            this.filterByClass(nextProps.filterValGroup);
        }
        if (nextProps.resetFilter && nextProps.resetFilter !== this.state.resetFilter) {
            this.setState({ filterPosts: this.state.posts });
        }
        // if (nextProps.refresh !== this.state.toggleRefresh) {
        //     let posts = [];
        //     let url = '/api/getUpcomingPosts';
        //     const origin = this.props.origin;
        //     if (origin === 'old') url = '/api/getArchivePosts';
        //     const res = await axios({
        //         method: 'GET',
        //         url
        //     });
        //     if (res.data[0]) {
        //         if (origin === 'upcoming') posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        //         else if (origin === 'old') posts = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        //         this.setState({ posts, filterPosts: posts, toggleRefresh: !this.state.toggleRefresh });
        //     } else if (res.data.error) {
        //         this.props.openError();
        //         this.setState({ posts: [], filterPosts: [] });
        //     }
        // }
    }
    filterPosts(filterVal) {
        const { posts } = this.state;
        const filterPosts = posts.filter(post => post.activity === filterVal);
        this.setState({ filterVal, filterPosts });
    }
    filterByClass(filterValGroup) {
        const { posts } = this.state;
        const filterPosts = posts.filter((post) => { // eslint-disable-line
            if (post.groups.indexOf(filterValGroup) !== -1) return post;
        });
        this.setState({ filterValGroup, filterPosts });
    }
    handlePostClick(id) {
        if (id !== this.state.descId && this.state.descId !== null) this.setState({ descId: id });
        else if (this.state.showDesc) this.setState({ showDesc: false, descId: null });
        else this.setState({ showDesc: true, descId: id });
    }
    // handleChipDelete(e) { // eslint-disable-line

    // }
    render() {
        const { filterPosts } = this.state;
        return (
            <div className="posts-main">
                {filterPosts && filterPosts.map((post, idx) => (
                    <div key={post.id} className="post-cont">
                        <div className="test">
                            <div className="fs14">
                                <span>{getMonth(post.start_date)} <b>{new Date(post.start_date).getDate()}</b></span>
                            </div>
                            <div className="bold-day">
                                {getDay(post.start_date)}
                            </div>
                            <div className="fs14">
                                {new Date(post.start_date).getFullYear()}
                            </div>
                        </div>
                        <Card className="mb10 card">
                            <div className="top">
                                <div className="post-title">
                                    <div className="act-title">{post.activity}</div>
                                    <div className="orig-title">{post.title}</div>
                                </div>
                            </div>
                            <div className="test2">
                                {post.groups && <span>{post.groups.join(', ')}</span>}
                            </div>
                            {this.state.showDesc && this.state.descId === idx && <div className="more-info">
                                {post.start_time && post.activity !== 'Anouncement' && <span> Location: {post.location} @ {post.start_time}</span>}
                                <p className="post-desc">{post.body}</p>
                            </div>}
                            <RaisedButton
                                aria-label="Toggle Description"
                                backgroundColor="#3498db"
                                labelColor="#ffffff"
                                label={this.state.showDesc && this.state.descId === idx ? 'Show Less' : 'Show More'}
                                onClick={() => this.handlePostClick(idx)}
                                className="mt10"
                            />
                            {/* <div className="chip-cont">
                                {this.props.user && (this.props.user.acct === 'admin' || this.props.user.acct === 'editor') &&
                                    <Tag
                                        onClick={this.props.addTags}
                                        role="button"
                                        tabIndex={0}
                                        className="text-left"
                                        id={post.id}
                                    />
                                }
                                {post.tags && <div>
                                    {post.tags.map(tag => (
                                        <Chip
                                            key={tag}
                                            onRequestDelete={this.handleChipDelete}
                                        >
                                            {tag}
                                        </Chip>
                                    ))}
                                </div>}
                                </div> */}
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
}

Posts.defaultProps = {
    filterVal: '',
    filterValGroup: '',
    classFilter: false
};

Posts.propTypes = {
    origin: PropTypes.string.isRequired, // eslint-disable-line
    filterVal: PropTypes.string.isRequired, // eslint-disable-line
    resetFilter: PropTypes.bool.isRequired, // eslint-disable-line
    openError: PropTypes.func.isRequired,
    // user: PropTypes.object.isRequired,
    // addTags: PropTypes.func.isRequired,
    // refresh: PropTypes.bool.isRequired, // eslint-disable-line
    filterValGroup: PropTypes.string // eslint-disable-line
};
