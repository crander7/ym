import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';

export default class Dashboard extends Component {
    render() {
        const { secretData } = this.props;
        return (
            <Card className="container">
                <CardTitle
                    title="Dashboard"
                    subtitle="You should get access to this page only after authentication."
                />
                {secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{secretData}</CardText>}
            </Card>
        );
    }
}

Dashboard.propTypes = {
    secretData: PropTypes.string.isRequired
};
