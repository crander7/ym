import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// import TextField from 'material-ui/TextField';
import Header from './../Header/Header';
import Posts from './../Posts/Posts';
import Drawer from './../Drawer/Drawer';
// import Auth from './../../modules/auth';
import './Home.scss';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            filtered: false,
            filterVal: '',
            filterValGroup: '',
            resetFilter: false,
            // openInput: false,
            openDialog: false,
            // tagPost: null,
            dialogTitle: '',
            dialogText: ''
            // tag: '',
            // refresh: false
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleFilterVal = this.handleFilterVal.bind(this);
        this.handleFilterReset = this.handleFilterReset.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.openErrorDialog = this.openErrorDialog.bind(this);
        this.handleGroupFilter = this.handleGroupFilter.bind(this);
        // this.openInputDialog = this.openInputDialog.bind(this);
        // this.handleTagInput = this.handleTagInput.bind(this);
        // this.handleTagSave = this.handleTagSave.bind(this);
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
        this.setState({ openInput: false, openDialog: false, tagPost: null, tag: '', dialogTitle: '', dialogText: '' });
    }
    openErrorDialog() {
        this.setState({ openDialog: true, dialogTitle: 'Error', dialogText: 'An error occured' });
    }
    // openInputDialog(e) {
    //     this.setState({ openInput: true, tagPost: e.currentTarget.id, dialogTitle: 'Add Tags', dialogText: 'Enter a tag for this activity' });
    // }
    // handleTagInput(e) {
    //     this.setState({ tag: e.target.value });
    // }
    // async handleTagSave() {
    //     if (this.state.tag !== '' && this.state.tagPost) {
    //         const res = await axios({
    //             method: 'POST',
    //             url: '/api/tags/add',
    //             headers: { Authorization: `bearer ${Auth.getToken()}` },
    //             data: {
    //                 tag: this.state.tag,
    //                 postId: this.state.tagPost
    //             }
    //         });
    //         console.log(res);
    //         if (res.data.success) {
    //             this.setState({ refresh: !this.state.refresh, openInput: false, dialogText: '', dialogTitle: '', tag: '', tagPost: null });
    //         } else {
    //             this.setState({ openDialog: true, dialogTitle: 'Error', dialogText: 'An error occured' });
    //         }
    //     } else if (this.state.tag === '') {
    //         this.setState({ openDialog: true, dialogTitle: 'Error', dialogText: 'You must enter a tag to save' });
    //     } else {
    //         this.setState({ openDialog: true, dialogTitle: 'Error', dialogText: 'An error occured' });
    //     }
    // }
    render() {
        const errActions = [
            <FlatButton
                label="Okay"
                primary={true}
                onTouchTap={this.handleRequestClose}
            />
        ];
        // const tagActions = [
        //     <FlatButton
        //         label="Cancel"
        //         onTouchTap={this.handleRequestClose}
        //     />,
        //     <FlatButton
        //         label="Save"
        //         primary={true}
        //         onTouchTap={this.handleTagSave}
        //     />
        // ];
        return (
            <div className="post-view">
                <Header
                    toggleDrawer={this.toggleDrawer}
                />
                <h3>Upcoming Events</h3>
                <Posts
                    origin="upcoming"
                    filterVal={this.state.filterVal}
                    filterValGroup={this.state.filterValGroup}
                    resetFilter={this.state.resetFilter}
                    openError={this.openErrorDialog}
                    // user={this.props.getUser()}
                    // addTags={this.openInputDialog}
                    // refresh={this.state.refresh}
                />
                <Drawer
                    user={this.props.getUser()}
                    page="home"
                    openDrawer={this.state.openDrawer}
                    handleFilterVal={this.handleFilterVal}
                    handleGroupFilter={this.handleGroupFilter}
                    toggleDrawer={this.toggleDrawer}
                    filtered={this.state.filtered}
                    resetFilter={this.handleFilterReset}
                />
                <Dialog
                    open={this.state.openDialog}
                    title={this.state.dialogTitle}
                    actions={errActions}
                    modal={false}
                    onRequestClose={this.handleRequestClose}
                >
                    {this.state.dialogText}
                </Dialog>
                {/* <Dialog
                    open={this.state.openInput}
                    title={this.state.dialogTitle}
                    actions={tagActions}
                    modal={false}
                    onRequestClose={this.handleRequestClose}
                >
                    <span>{this.state.dialogText}</span>
                    <TextField
                        hintText="Tag"
                        value={this.state.tag}
                        onChange={this.handleTagInput}
                    />
                </Dialog> */}
            </div>
        );
    }
}

Home.propTypes = {
    getUser: PropTypes.func.isRequired
};
