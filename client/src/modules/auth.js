import jwtDecode from 'jwt-decode';

const Auth = {
    authenticateUser: (token) => {
        localStorage.setItem('token', token);
    },
    isUserAuthenticated: () => {
        let token = null;
        try {
            token = jwtDecode(localStorage.getItem('token'));
        } catch (e) {
            localStorage.removeItem('token');
        }
        return token;
    },
    deauthenticateUser: () => {
        localStorage.removeItem('token');
    },
    getToken: () => localStorage.getItem('token')
};

export default Auth;
