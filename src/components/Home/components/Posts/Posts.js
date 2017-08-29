import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
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
            descId: null
        };
        this.handlePostClick = this.handlePostClick.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ posts: nextProps.posts });
    }
    handlePostClick(id) {
        if (id !== this.state.descId && this.state.descId !== null) this.setState({ descId: id });
        else if (this.state.showDesc) this.setState({ showDesc: false, descId: null });
        else this.setState({ showDesc: true, descId: id });
    }
    render() {
        const { posts } = this.state;
        return (
            <div className="posts-main">
                {posts && posts.map((post, idx) => (
                    <div
                        className="remove-outline"
                        role="button"
                        tabIndex="0"
                        key={post.id}
                        onClick={() => this.handlePostClick(idx)}
                    >
                        <div className="post-title">
                            <span className="act-title">{post.activity}:</span>
                            <span className="orig-title"> {post.title}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <span><b>{getDay(post.start_date)}, </b></span>
                            <span>{formatTimestamp(post.start_date)}</span>
                        </div>
                        <div>
                            <span>{post.party}</span>
                            {post.start_time && <span> meet @ {post.start_time}</span>}
                        </div>
                        {this.state.showDesc && this.state.descId === idx && <p style={{ maxWidth: '300px', margin: 'auto', marginTop: '15px' }}>{post.body}</p>}
                        {idx !== posts.length - 1 && <hr style={{ width: '200px', marginTop: '20px' }} />}
                    </div>
                ))}
            </div>
        );
    }
}

Posts.defaultProps = {
    posts: []
};

Posts.propTypes = {
    posts: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.arrayOf(PropTypes.object)
    ])
};
