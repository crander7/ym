import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';
import Auth from './modules/auth';

import App from './components/App/App';
import Home from './components/Home/Home';
import PostCreator from './components/AddPost/AddPost';
import EditPosts from './components/EditPosts/EditPosts';
import OldPosts from './components/OldPosts/OldPosts';
import PostEditor from './components/PostEditor/PostEditor';
import SignUp from './components/SignUpPage/SignUpPage';
import Login from './components/LoginPage/LoginPage';
import NotFound from './components/NotFound/NotFound';

export default props => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route
                path="/addPost"
                getComponent={(location, callback) => {
                    if (Auth.isUserAuthenticated()) {
                        callback(null, PostCreator);
                    } else {
                        callback(null, Login);
                    }
                }}
            />
            <Route
                path="/editPosts"
                getComponent={(location, callback) => {
                    if (Auth.isUserAuthenticated()) {
                        callback(null, EditPosts);
                    } else {
                        callback(null, Login);
                    }
                }}
            />
            <Route path="/pastActivities" component={OldPosts} />
            <Route
                path="/postEditor/:postID"
                getComponent={(location, callback) => {
                    if (Auth.isUserAuthenticated()) {
                        callback(null, PostEditor);
                    } else {
                        callback(null, Login);
                    }
                }}
            />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route
                path="/logout"
                onEnter={(nextState, replace) => {
                    Auth.deauthenticateUser();
                    replace('/');
                }}
            />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);
