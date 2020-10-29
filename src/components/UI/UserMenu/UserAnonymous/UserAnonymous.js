import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logIn } from '../../../../store/actions/user';
import classes from './UserAnonymous.module.css';
import { logUser } from '../../../../services/CK';

const UserAnonymous = props => {

    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: ''
    });

    const [saveDisabled, setSaveDisabled] = useState(true)
    const [logInError, setlogInError] = useState(false)

    const checkSaveDisabled = (event, credentials) => {
        if (event.target.value.trim().length === 0) {
            event.target.classList.add(classes.Invalid)
        } else {
            event.target.classList.remove(classes.Invalid)
        }

        setSaveDisabled(
            credentials.email.trim().length === 0 ||
            credentials.password.trim().length === 0
        );
    }

    useEffect(() => {      
        setUserCredentials({
            email: '',
            password: ''
        })
        setSaveDisabled(true)
        setlogInError(false)
        
    }, [props.show]);

    const emailChangeHandler = event => {
        setUserCredentials(prevState => {
            const newCredentials = {
                ...prevState,
                email: event.target.value
            }
            checkSaveDisabled(event, newCredentials);
            return newCredentials;
        });
    }

    const passwordChangeHandler = event => {
        setUserCredentials(prevState => {
            const newCredentials = {
                ...prevState,
                password: event.target.value
            }
            checkSaveDisabled(event, newCredentials);
            return newCredentials;
        });
    }

    const loginHandler = () => {
        logUser(userCredentials.email, userCredentials.password)
        .then(respopnse => {
            if(respopnse.status === 200) {
                if(respopnse.data.error) {
                    setlogInError(true)
                } else {                    
                    props.close();
                    props.onUserLogIn(respopnse.data);
                }
            }
        })
        .catch(() => setlogInError(true));
    }

    return (
        <div className={classes.User}>
            <h3>Login</h3>
            <input
                style={{ marginBottom: '10px' }}
                type='email'
                placeholder='E-mail'
                onChange={emailChangeHandler}
                value={userCredentials.email} />
            <input
                style={{ marginBottom: '10px' }}
                type='password'
                placeholder='Password'
                onChange={passwordChangeHandler}
                onKeyDown={(event) => event.key === 'Enter' && !saveDisabled ? loginHandler() : null}
                value={userCredentials.password} />
            {logInError ? 
                <p>Invalid credentials</p> : null}
            <button 
                disabled={saveDisabled}
                onClick={loginHandler}>
                Submit
            </button>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    onUserLogIn: user => dispatch(logIn(user))
});

export default connect(null, mapDispatchToProps)(UserAnonymous);