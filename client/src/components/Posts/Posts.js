import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
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
                    <Card
                        key={post.id}
                        style={{
                            marginBottom: '10px',
                            padding: '20px 10px'
                        }}
                    >
                        <div className="post-title">
                            <span className="act-title">{post.activity}:</span>
                            <span className="orig-title"> {post.title}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <span><b>{getDay(post.start_date)}, </b></span>
                            <span>{formatTimestamp(post.start_date)}</span>
                        </div>
                        {this.state.showDesc && this.state.descId === idx && <div>
                            <span>{post.party}</span>
                            {post.start_time && <span> meet @ {post.start_time}</span>}
                            <p style={{ maxWidth: '300px', margin: 'auto', marginTop: '10px' }}>{post.body}</p>
                        </div>}
                        <RaisedButton
                            primary={true}
                            label={this.state.showDesc && this.state.descId === idx ? 'Show Less' : 'Show More'}
                            onClick={() => this.handlePostClick(idx)}
                            style={{ marginTop: '10px' }}
                        />
                        {/* idx !== posts.length - 1 && <hr style={{ width: '200px', marginTop: '20px' }} /> */}
                    </Card>
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
