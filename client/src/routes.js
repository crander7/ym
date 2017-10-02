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
import Admin from './components/AdminPage/AdminPage';
import Account from './components/Account/Account';
import Denied from './components/Denied/Denied';
import NotFound from './components/NotFound/NotFound';

export default (props) => {
    const checkAuth = (nextState, replace) => {
        const user = Auth.isUserAuthenticated();
        if (!user) replace('/login');
    };
    const checkEdit = (nextState, replace) => {
        const user = Auth.isUserAuthenticated();
        if (!user || (user.acct !== 'admin' && user.acct !== 'editor')) replace('/denied');
    };
    const checkAdmin = (nextState, replace) => {
        const user = Auth.isUserAuthenticated();
        if (!user || user.acct !== 'admin') replace('/denied');
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
                            replace(Home);
                        } else replace(Login);
                    }}
                />
                <Route
                    path="account"
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
                        replace(Home);
                    }}
                />
                <Route
                    path="denied"
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
