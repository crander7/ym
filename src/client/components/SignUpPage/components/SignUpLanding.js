import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import Close from 'material-ui/svg-icons/navigation/close';

const authBaseUrl = window.location.host.indexOf('localhost') === -1 ? 'https://1stwardym.com' : 'http://localhost:3000';

export default class SignUpLanding extends Component {
    render() {
        return (
            <div>
                <div className="outer-form" />
                <Card className="container inner-form">
                    {this.props.closeLogin ?
                        <div
                            tabIndex={0}
                            aria-label="Close"
                            focusable="true"
                            className="upper-x"
                            onClick={e => this.props.closeLogin(e, true, 'signup')}
                            role="button"
                        >
                            <Close />
                        </div> :
                        <Link
                            to="/"
                            className="upper-x normalize-link"
                        >
                            <Close />
                        </Link>
                    }
                    <a href={`${authBaseUrl}/auth/facebook`} className="fb-button">
                        <div className="btn-cont">
                            <div className="icon-cont">
                                <svg viewBox="0 0 32 32" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', fill: 'currentcolor', height: '18px', width: '18px' }}>
                                    <path fillRule="evenodd" d="M8 14.408v-4.165c0-.424.35-.812.77-.812h2.519V7.347c0-4.84 2.484-7.311 7.42-7.347 1.645 0 3.219.212 4.692.636.455.141.63.424.595.883l-.56 4.062c-.035.178-.14.354-.315.531-.21.105-.42.176-.63.14-.875-.247-1.784-.352-2.799-.352-1.399 0-1.61.283-1.61 1.73v1.8H22.6c.42 0 .805.423.805.883l-.349 4.17c0 .422-.35.705-.77.705H18.08v16c0 .424-.349.812-.769.812h-5.213c-.42 0-.804-.388-.804-.812V15.185h-2.52A.781.781 0 0 1 8 14.408" />
                                </svg>
                            </div>
                            <div className="text-cont">
                                <span className="network">Sign up with Facebook</span>
                            </div>
                        </div>
                    </a>
                    <a href={`${authBaseUrl}/auth/google`} className="g-button">
                        <div className="btn-cont">
                            <div className="icon-cont">
                                <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', height: '18px', width: '18px' }}>
                                    <g fill="none" fillRule="evenodd">
                                        <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335" />
                                        <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4" />
                                        <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05" />
                                        <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853" />
                                        <path d="M0 0h18v18H0V0z" />
                                    </g>
                                </svg>
                            </div>
                            <div className="text-cont g">
                                <span className="network">Sign up with Google</span>
                            </div>
                        </div>
                    </a>
                    <div className="divider">
                        <div>
                            <span className="span-div">
                                <span>
                                    <span className="login-div">or</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/signup"
                        className="normalize-link email-btn"
                    >
                        <div className="btn-cont">
                            <div className="icon-cont">
                                <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', fill: 'currentcolor', height: '18px', width: '18px' }}>
                                    <path
                                        fillRule="evenodd"
                                        d="M22.497 4H1.503C.665 4 0 4.673 0 5.507v12.985C0 19.326.672 20 1.503 20h20.994A1.5 1.5 0 0 0 24 18.492V5.507C24 4.674 23.328 4 22.497 4zM23 18.203l-6.141-7.907L23 5.628v12.575zM22.174 5l-9.685 7.362c-.259.196-.719.196-.977 0L1.827 5h20.347zM1 5.628l6.14 4.667L1 18.185V5.629zM1.634 19l6.302-8.1 2.97 2.258c.616.468 1.572.468 2.188 0l2.969-2.257L22.353 19H1.633z"
                                    />
                                </svg>
                            </div>
                            <div className="text-cont">
                                <span className="network">Sign up with Email</span>
                            </div>
                        </div>
                    </Link>
                    <div>
                        <div className="bottom-div" />
                    </div>
                    <CardText>{'Already have an account?'} <Link style={{ color: '#2A798E' }} className="normalize-link" to={'/login'}>Log in</Link></CardText>
                </Card>
            </div>
        );
    }
}

SignUpLanding.defaultProps = {
    closeLogin: null
};

SignUpLanding.propTypes = {
    closeLogin: PropTypes.func
};
