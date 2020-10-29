import React, { Fragment, useEffect, useRef } from 'react';
import Backdrop from '../../Backdrop/Backdrop';
import classes from './SideDrawer.module.css';
import { focusFirstAvailable } from '../../../../Utility'

const SideDrawer = (props) => {
    const mainContainer = useRef(null);
    let currentClasses = [classes.SideDrawer];

    useEffect(() => {
        if (props.show) {
            focusFirstAvailable(mainContainer);
        }
    }, [props.show])

    currentClasses.push(props.right ? classes.SideDrawerRight : classes.SideDrawerLeft)
    currentClasses.push(props.show ?
        (props.right ? classes.OpenRight : classes.OpenLeft) :
        (props.right ? classes.CloseRight : classes.CloseLeft));

    return (
        <Fragment>
            <Backdrop show={props.show} clicked={props.close} />
            <div ref={mainContainer} className={currentClasses.join(' ')} onKeyDown={event => event.key === 'Escape' ? props.close() : null}>
                {props.title ? props.title : null}
                {props.children}
            </div>
        </Fragment>
    );
}

export default SideDrawer;