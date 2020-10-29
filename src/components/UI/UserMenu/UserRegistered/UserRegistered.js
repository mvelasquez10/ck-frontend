import React from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../../../store/actions/user';
import { showConfirmAction } from '../../../../store/actions/UI';
import { resetRepo } from '../../../../services/CK';
import classes from './UserRegistered.module.css';

const UserRegistered = props => {

    const resetApp = () => resetRepo()
        .then(response => {
            if (response.status === 200) {
                window.location.reload()
            }
        }).catch((error) => console.log(error));

    const resetMessage = 'You are going to restore the app to its original state, do you wish to continue?';

    const resetButton = props.user.isAdmin ?
        <button onClick={() => {
            props.close();
            props.onConfirmAction(resetMessage, resetApp);
        }}>Restore App</button> : null

    return (
        <div className={classes.User}>
            <h3>Welcome back!</h3>
            <p>{props.user.name} {props.user.surname}</p>
            <button onClick={() => {
                props.close();
                props.onUserLogOut();
            }}>Log out</button>
            {resetButton}
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user.user
});

const mapDisplatchToProps = dispatch => ({
    onUserLogOut: () => dispatch(logOut()),
    onConfirmAction : (message, confirm) => dispatch(showConfirmAction(message, confirm))
});

export default connect(mapStateToProps, mapDisplatchToProps)(UserRegistered);