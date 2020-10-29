import React from 'react';
import classes from './Toolbar.module.css';
import ckLogo from '../../../../assets/images/ck.png'
import userLogo from '../../../../assets/images/user.png';
import { connect } from 'react-redux';
import { resetPost } from '../../../../store/actions/post';

const Toolbar = props => (
    <header className={classes.Toolbar}>
        <div style={{ minWidth: '60px' }}>
        </div>
        <div>
            <span className={classes.Title}>Collective</span>
            <img className={classes.ImageLogo} src={ckLogo} onClick={() => props.onResetPost(true)} alt='CK Logo' />
            <span className={classes.Title}>Knowledge</span>
        </div>
        <div style={{ minWidth: '60px', flexFlow: 'row-reverse' }} onClick={props.openUser}>
            {props.user && props.user.name ?
                <span style={{ background: 'magenta' }} className={classes.User}>{getUserInitials(props.user)}</span> :
                <img style={{ background: '#ddd' }} className={classes.User} src={userLogo} alt='user' />
            }
        </div>
    </header>
);

const getUserInitials = user => {
    return user.name[0].toLocaleUpperCase() + (user.surname ? user.surname[0].toLocaleUpperCase() : '')
}

const mapStateToProps = state => ({
    user: state.user.user
});

const mapDispatchToProps = dispatch => ({
    onResetPost: set => dispatch(resetPost(set))
})

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);