import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Auth from './modules/auth';

import Home from './components/Home/Home';
import PostCreator from './components/AddPost/AddPost';
import EditPosts from './components/EditPosts/EditPosts';
import OldPosts from './components/OldPosts/OldPosts';
import PostEditor from './components/PostEditor/PostEditor';
import SignUp from './components/SignUpPage/SignUpPage';
import Login from './components/LoginPage/LoginPage';
import Admin from './components/AdminPage/AdminPage';
import Account from './components/Account/Account';
import Spam from './components/Spam/Spam';
import Denied from './components/Denied/Denied';
import LoginFail from './components/LoginFail/LoginFail';
import NotFound from './components/NotFound/NotFound';
import CheckinRes from './components/CheckinRes/CheckinRes';

export default () => {
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
        console.log('hit');
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
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={props => <Home {...getProps(props)} />}
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
                    render={props => <OldPosts {...getProps(props)} />}
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
                        if (query.success === 'true') {
                            Auth.authenticateUser(query.token);
                            if (query.newUser === 'true') replace({ pathname: '/account' });
                            else replace({ pathname: '/' });
                        } else {
                            replace({ pathname: '/loginFail', state: query.message });
                        }
                    }}
                />
                <Route
                    path="/checkin"
                    component={CheckinRes}
                />
                <Route
                    path="/account"
                    render={props => <Account {...getProps(props)} />}
                    onEnter={checkAuth}
                />
                <Route
                    path="/admin"
                    component={Admin}
                    onEnter={checkAdmin}
                    getUser={Auth.isUserAuthenticated}
                />
                <Route
                    path="/spam"
                    render={props => <Spam {...getProps(props)} />}
                    onEnter={checkAdmin}
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
                    path="/loginFail"
                    component={LoginFail}
                />
                <Route
                    path="*"
                    component={NotFound}
                />
            </Switch>
        </Router>
    );
};

/**
 * 
 * @param {*} props route props
 * @returns {*} object 
 */
function getProps(props) {
    const newProps = Object.assign({}, props, { getUser: Auth.isUserAuthenticated });
    return newProps;
}
