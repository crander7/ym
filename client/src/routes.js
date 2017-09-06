import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';

import App from './components/App/App';
import Home from './components/Home/Home';
import PostCreator from './components/AddPost/AddPost';
import EditPosts from './components/EditPosts/EditPosts';
import OldPosts from './components/OldPosts/OldPosts';
import PostEditor from './components/PostEditor/PostEditor';
import NotFound from './components/NotFound/NotFound';

export default props => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/addPost" component={PostCreator} />
            <Route path="/editPosts" component={EditPosts} />
            <Route path="/pastActivities" component={OldPosts} />
            <Route path="/postEditor/:postID" component={PostEditor} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);
