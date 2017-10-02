import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import Card from 'material-ui/Card';
import './Posts.css';

const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
};

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

const formatTimestamp = (date) => {
    const start = new Date(date);
    return start.toLocaleDateString('en-US', options);
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
            resetFilter: false
        };
        this.handlePostClick = this.handlePostClick.bind(this);
        this.filterPosts = this.filterPosts.bind(this);
    }
    async componentWillMount() {
        let posts = [];
        let url = '/api/getUpcomingPosts';
        const origin = this.props.origin;
        if (origin === 'old') url = '/api/getArchivePosts';
        const res = await axios({
            method: 'get',
            url
        });
        if (res.data[0]) {
            if (origin === 'upcoming') posts = res.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            else if (origin === 'old') posts = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            this.setState({ posts, filterPosts: posts });
        } else this.setState({ posts: [], filterPosts: [] });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.filterVal !== '' && nextProps.filterVal !== this.state.filterVal) {
            this.filterPosts(nextProps.filterVal);
        }
        if (nextProps.resetFilter && nextProps.resetFilter !== this.state.resetFilter) {
            this.setState({ filterPosts: this.state.posts });
        }
    }
    filterPosts(filterVal) {
        const { posts } = this.state;
        const filterPosts = posts.filter(post => post.activity === filterVal);
        this.setState({ filterVal, filterPosts });
    }
    handlePostClick(id) {
        if (id !== this.state.descId && this.state.descId !== null) this.setState({ descId: id });
        else if (this.state.showDesc) this.setState({ showDesc: false, descId: null });
        else this.setState({ showDesc: true, descId: id });
    }
    render() {
        const { filterPosts } = this.state;
        return (
            <div className="posts-main">
                {filterPosts && filterPosts.map((post, idx) => (
                    <Card
                        key={post.id}
                        className="mb10 card"
                    >
                        <div className="post-title">
                            <span className="act-title">{post.activity}:</span>
                            <span className="orig-title"> {post.title}</span>
                        </div>
                        <div className="mb10 new-style">
                            <span><b>{getDay(post.start_date)}, </b></span>
                            <span>{formatTimestamp(post.start_date)}</span>
                        </div>
                        {this.state.showDesc && this.state.descId === idx && <div>
                            <span>{post.party}</span>
                            {post.start_time && <span> meet @ {post.start_time}</span>}
                            <p className="post-desc">{post.body}</p>
                        </div>}
                        <RaisedButton
                            aria-label="Toggle Description"
                            backgroundColor="#F46036"
                            labelColor="#ffffff"
                            label={this.state.showDesc && this.state.descId === idx ? 'Show Less' : 'Show More'}
                            onClick={() => this.handlePostClick(idx)}
                            className="mt10"
                        />
                    </Card>
                ))}
            </div>
        );
    }
}

Posts.defaultProps = {
    filterVal: ''
    // F46036
    // 009FFD
};

Posts.propTypes = {
    origin: PropTypes.string.isRequired,
    filterVal: PropTypes.string.isRequired,
    resetFilter: PropTypes.bool.isRequired
};
