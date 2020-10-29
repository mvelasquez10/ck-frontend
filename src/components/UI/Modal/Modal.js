import React, { Fragment, useEffect, useRef } from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';
import { focusFirstAvailable } from '../../../Utility';

const Modal = props => {
    const mainContainer = useRef(null);

    useEffect(() => {
        if (props.show) {
            focusFirstAvailable(mainContainer);
        }
    }, [props.show])

    return (
        <Fragment>
            <Backdrop show={props.show} clicked={props.close} />
            <div
                ref={mainContainer}
                onKeyDown={event => event.key === 'Escape' ? props.close() : null}
                className={props.noWrap ? classes.ModalNoWrap : classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                {props.children}
            </div>
        </Fragment>)
}

export default Modal;