import jwtDecode from 'jwt-decode';

const Auth = {
    authenticateUser: (token) => {
        localStorage.setItem('token', token);
    },
    isUserAuthenticated: () => {
        let user = null;
        try {
            user = jwtDecode(localStorage.getItem('token'));
        } catch (e) {
            localStorage.removeItem('token');
        }
        return user;
    },
    deauthenticateUser: () => {
        localStorage.removeItem('token');
    },
    getToken: () => localStorage.getItem('token')
};

export default Auth;
