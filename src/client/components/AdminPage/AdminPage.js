import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Menu from 'material-ui/svg-icons/navigation/apps';
import Approve from 'material-ui/svg-icons/action/thumb-up';
import Deny from 'material-ui/svg-icons/action/thumb-down';
import Person from 'material-ui/svg-icons/social/person';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import MaterialMenu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Header from './../Header/Header';
import Drawer from './../Drawer/Drawer';
import Auth from './../../modules/auth';

export default class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editReqs: null,
            error: false,
            openDialog: false,
            openDrawer: false,
            openActions: false,
            anchorEl: null,
            popoverID: null,
            user: null
        };
        this.handleActions = this.handleActions.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDecision = this.handleDecision.bind(this);
        this.showMore = this.showMore.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }
    async componentWillMount() {
        const res = await axios({
            method: 'GET',
            url: '/api/getEditReqs',
            headers: { Authorization: `bearer ${Auth.getToken()}` }
        });
        if (res.data[0]) {
            if (res.data[0]) this.setState({ editReqs: res.data });
        } else if (res.data.error) {
            this.setState({ error: true });
        } else if (res.data.authError) {
            Auth.deauthenticateUser();
            location.pathname = '/login';
        }
    }
    handleActions(evt, id) {
        this.setState({ openActions: true, popoverID: id, anchorEl: evt.currentTarget });
    }
    handleClose() {
        this.setState({ openDialog: false, error: false, openActions: false, popoverID: null, anchorEl: null, user: null });
    }
    async handleDecision(user, approved) {
        const { editReqs } = this.state;
        const res = await axios({
            method: 'POST',
            url: '/api/handleEditReq',
            headers: { Authorization: `bearer ${Auth.getToken()}` },
            data: { ...user, approved }
        });
        if (res.data.success) {
            for (let i = editReqs.length - 1; i >= 0; i -= 1) {
                if (user.id === editReqs[i].id) editReqs.splice(i, 1);
            }
            this.setState({ editReqs, openActions: false });
        } else if (res.data.error) this.setState({ openDialog: true, error: true, openActions: false });
    }
    showMore(user) {
        this.setState({ openDialog: true, user, openActions: false });
    }
    toggleDrawer(openDrawer) {
        this.setState({ openDrawer });
    }
    render() {
        const errActions = [
            <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />
        ];
        return (
            <div>
                <Header
                    toggleDrawer={this.toggleDrawer}
                />
                {this.state.editReqs && <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} selectable={false} displayRowCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.editReqs && this.state.editReqs.map(user => (
                            <TableRow
                                key={user.id}
                                selectable={false}
                            >
                                <TableRowColumn
                                    data-tip={`Birthday: ${new Date(user.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
                                >
                                    {user.display_name}
                                </TableRowColumn>
                                <TableRowColumn
                                    data-tip={`Status: ${user.account}`}
                                >
                                    {user.email}
                                </TableRowColumn>
                                <TableRowColumn>
                                    <Menu
                                        onClick={e => this.handleActions(e, user.id)}
                                    />
                                    <Popover
                                        open={this.state.openActions && this.state.popoverID === user.id}
                                        anchorEl={this.state.anchorEl}
                                        onRequestClose={this.handleClose}
                                    >
                                        <MaterialMenu>
                                            <MenuItem
                                                primaryText="Approve"
                                                onClick={() => this.handleDecision(user, true)}
                                                rightIcon={<Approve />}
                                            />
                                            <MenuItem
                                                primaryText="Deny"
                                                onClick={() => this.handleDecision(user, false)}
                                                rightIcon={<Deny />}
                                            />
                                            <Divider />
                                            <MenuItem
                                                primaryText="Details"
                                                onClick={() => this.showMore(user)}
                                                rightIcon={<Person />}
                                            />
                                        </MaterialMenu>
                                    </Popover>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                <ReactTooltip />
                {!this.state.editReqs && <h2 style={{ textAlign: 'center' }}>No Requests Currently</h2>}
                <Drawer
                    user={this.props.route.getUser()}
                    openDrawer={this.state.openDrawer}
                    toggleDrawer={this.toggleDrawer}
                />
                <Dialog
                    title={this.state.error ? 'Error' : 'User Details'}
                    modal={false}
                    open={this.state.openDialog}
                    onRequestClose={this.handleClose}
                    actions={errActions}
                >
                    {this.state.error ? 'An error occurred as we processed your request.' : this.state.user ? <div><p>{`Name: ${this.state.user.display_name}`}</p><p>{`Email: ${this.state.user.email}`}</p><p>{`Status: '${this.state.user.account.charAt(0).toUpperCase()}${this.state.user.account.substring(1)}'`}</p><p>{`Birthday: ${this.state.user.birthday ? new Date(this.state.user.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}`}</p></div> : '' }
                </Dialog>
            </div>
        );
    }
}

AdminPage.propTypes = {
    route: PropTypes.object.isRequired
};
