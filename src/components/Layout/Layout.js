import React, { Fragment, useState } from 'react';
import classes from './Layout.module.css';
import Toolbar from '../UI/Navigation/Toolbar/Toolbar';
import SideDrawer from '../UI/Navigation/SideDrawer/SideDrawer';
import UserMenu from '../UI/UserMenu/UserMenu';
import Modal from '../UI/Modal/Modal';
import { closeConfirmAction } from '../../store/actions/UI';
import { connect } from 'react-redux';

const Layout = props => {

    const [ShowUser, setShowUser] = useState(false);

    return (
        <Fragment>
            <Modal show={props.confirmAction.show} >
                <p>{props.confirmAction.message}</p>
                <button onClick={() => {
                    props.confirmAction.confirm();
                    props.onCancel();
                }}>Confirm</button>
                <button onClick={() => props.onCancel()}>Cancel</button>
            </Modal>
            <Toolbar
                openUser={() => setShowUser(true)} />
            <SideDrawer
                right
                show={ShowUser}
                close={() => setShowUser(false)}>
                <UserMenu show={ShowUser} close={() => setShowUser(false)} />
            </SideDrawer>
            <main className={classes.Main}>
                <div>
                    {props.children}
                </div>
            </main>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    confirmAction: state.confirmAction.confirmAction
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeConfirmAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);