import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';
import axios from 'axios';
import Auth from './modules/auth';

import App from './components/App/App';
import Home from './components/Home/Home';
import PostCreator from './components/AddPost/AddPost';
import EditPosts from './components/EditPosts/EditPosts';
import OldPosts from './components/OldPosts/OldPosts';
import PostEditor from './components/PostEditor/PostEditor';
import SignUp from './components/SignUpPage/SignUpPage';
import Login from './components/LoginPage/LoginPage';
import Admin from './components/AdminPage/AdminPage';
import Account from './components/Account/Account';
import Denied from './components/Denied/Denied';
import NotFound from './components/NotFound/NotFound';

export default (props) => {
    const checkAuth = async (nextState, replace, callback) => {
        const res = await axios({
            method: 'GET',
            url: `/auth/check4Token/${Auth.getToken()}`
        });
        if (res.data.success) {
            const user = Auth.isUserAuthenticated();
            if (!user) {
                replace({ pathname: '/login' });
                callback();
            } else callback();
        } else {
            Auth.deauthenticateUser();
            replace({ pathname: '/login' });
            callback();
        }
    };
    const checkEdit = async (nextState, replace, callback) => {
        const res = await axios({
            method: 'GET',
            url: `/auth/check4Token/${Auth.getToken()}`
        });
        if (res.data.success) {
            const user = Auth.isUserAuthenticated();
            if (!user || (user.acct !== 'admin' && user.acct !== 'editor')) {
                replace({ pathname: '/denied' });
                callback();
            } else callback();
        } else {
            Auth.deauthenticateUser();
            replace({ pathname: '/login' });
            callback();
        }
    };
    const checkAdmin = async (nextState, replace, callback) => {
        const res = await axios({
            method: 'GET',
            url: `/auth/check4Token/${Auth.getToken()}`
        });
        if (res.data.success) {
            const user = Auth.isUserAuthenticated();
            if (!user || user.acct === 'editor' || user.acct === 'user') {
                replace({ pathname: '/denied' });
                callback();
            } else callback();
        } else {
            Auth.deauthenticateUser();
            replace({ pathname: '/login' });
            callback();
        }
    };
    return (
        <Router {...props}>
            <Route path="/" component={App}>
                <IndexRoute
                    component={Home}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/signup"
                    component={SignUp}
                />
                <Route
                    path="/login"
                    component={Login}
                />
                <Route
                    path="/pastActivities"
                    component={OldPosts}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/addPost"
                    component={PostCreator}
                    onEnter={checkEdit}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/editPosts"
                    component={EditPosts}
                    onEnter={checkEdit}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/postEditor/:postID"
                    component={PostEditor}
                    onEnter={checkEdit}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/addToken"
                    onEnter={(nextState, replace) => {
                        const query = nextState.location.query;
                        if (query.success) {
                            Auth.authenticateUser(query.token);
                            if (query.newUser === 'true') replace({ pathname: '/account' });
                            else replace({ pathname: '/' });
                        } else replace({ pathname: '/login' });
                    }}
                />
                <Route
                    path="/account"
                    component={Account}
                    onEnter={checkAuth}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/admin"
                    component={Admin}
                    onEnter={checkAdmin}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/logout"
                    onEnter={(nextState, replace) => {
                        Auth.deauthenticateUser();
                        replace({ pathname: '/' });
                    }}
                />
                <Route
                    path="/denied"
                    component={Denied}
                />
                <Route
                    path="*"
                    component={NotFound}
                />
            </Route>
        </Router>
    );
};
