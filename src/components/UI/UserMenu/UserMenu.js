import React from 'react';
import { connect } from 'react-redux';
import UserAnonymous from './UserAnonymous/UserAnonymous';
import UserRegistered from './UserRegistered/UserRegistered';

const UserMenu = props => (
    props.user && props.user.id ?
        <UserRegistered close={props.close} /> :
        <UserAnonymous show={props.show} close={props.close} />
);

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(mapStateToProps)(UserMenu);