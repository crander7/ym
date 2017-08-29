import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';

import App from './components/App/App';
import Home from './components/Home/Home';
import PostCreator from './components/AddPost/AddPost';
import PostEditor from './components/EditPosts/EditPosts';
import NotFound from './components/NotFound/NotFound';

export default props => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/addPost" component={PostCreator} />
            <Route path="/editPosts" component={PostEditor} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);
