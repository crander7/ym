import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Header from './../Header/Header';
import Drawer from './../Drawer/Drawer';
import Posts from './../Posts/Posts';
import './OldPosts.scss';

export default class OldPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            filtered: false,
            filterVal: '',
            filterValGroup: '',
            resetFilter: false,
            openDialog: false
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleFilterVal = this.handleFilterVal.bind(this);
        this.handleFilterReset = this.handleFilterReset.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.openErrorDialog = this.openErrorDialog.bind(this);
        this.handleGroupFilter = this.handleGroupFilter.bind(this);
    }
    handleFilterVal(filterVal) {
        this.setState({ filterVal, openDrawer: false, resetFilter: false, filtered: true });
    }
    handleGroupFilter(filterValGroup) {
        this.setState({ filterValGroup, openDrawer: false, resetFilter: false, filtered: true });
    }
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    handleFilterReset() {
        this.setState({ resetFilter: true, filtered: false, openDrawer: false });
    }
    handleRequestClose() {
        this.setState({ openDialog: false });
    }
    openErrorDialog() {
        this.setState({ openDialog: true });
    }
    render() {
        const errActions = [
            <FlatButton
                label="Okay"
                primary={true}
                onTouchTap={this.handleRequestClose}
            />
        ];
        return (
            <div className="post-view">
                <Header toggleDrawer={this.toggleDrawer} />
                <h3 className="old-header">Past Posts</h3>
                <Posts
                    origin="old"
                    filterVal={this.state.filterVal}
                    filterValGroup={this.state.filterValGroup}
                    resetFilter={this.state.resetFilter}
                    openError={this.openErrorDialog}
                    user={this.props.getUser()}
                />
                <Drawer
                    user={this.props.getUser()}
                    openDrawer={this.state.openDrawer}
                    page="past"
                    handleFilterVal={this.handleFilterVal}
                    handleGroupFilter={this.handleGroupFilter}
                    toggleDrawer={this.toggleDrawer}
                    filtered={this.state.filtered}
                    resetFilter={this.handleFilterReset}
                />
                <Dialog
                    open={this.state.openDialog}
                    title="Error"
                    actions={errActions}
                    modal={false}
                    onRequestClose={this.handleRequestClose}
                >
                    {'An error occured'}
                </Dialog>
            </div>
        );
    }
}

OldPosts.propTypes = {
    getUser: PropTypes.func.isRequired
};
