import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from './../../assets/rebels.svg';


export default class NotFound extends Component {
    render() {
        const styles = {
            flexStyle: {
                display: 'flex',
                alignItems: 'center',
                color: 'black'
            },
            defStyle: {
                position: 'absolute',
                left: '5vw',
                top: '3vh'
            },
            videoStyle: {
                position: 'fixed',
                top: '75%',
                left: '-50%',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto',
                zIndex: '-100',
                transform: 'translateX(-50%) translateY(-50%)'
            },
            imgStyle: {
                height: '25px',
                width: '25px'
            },
            titleStyle: {
                fontSize: '76px',
                color: 'black',
                fontWeight: '200',
                margin: '0'
            },
            subTitleStyle: {
                margin: '0'
            }
        };
        return (
            <div className="NotFound">
                <video
                    className="hotdog"
                    style={styles.videoStyle}
                    src="https://cdn.ueno.co/bf2836011ceb814ed1d78f8702487bc4.mp4"
                    loop
                    muted
                    autoPlay
                >
                    <track kind="captions" />
                </video>
                <div className="text-overlay" style={styles.defStyle}>
                    <h1 style={styles.titleStyle}>404</h1>
                    <h2 style={styles.subTitleStyle}>Not Found</h2>
                    <p style={{ width: '250px' }}>
                        You came here, looking for something, and all you get is this silly running hot dog. Not good. Not good at all.
                    </p>
                    <div>
                        <Link to="/" style={styles.flexStyle}>
                            <img
                                src={logo}
                                alt="arrow"
                                style={styles.imgStyle}
                            />
                            <span style={{ marginLeft: '5px' }}><strong>Go Back</strong></span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
