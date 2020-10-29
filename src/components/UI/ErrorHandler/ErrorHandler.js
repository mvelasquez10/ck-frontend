import React, { useEffect, useState, useRef, Fragment } from 'react';
import Modal from '../Modal/Modal';

const ErrorHandler = props => {

    let requestHandler = useRef(null);
    let responseHandler = useRef(null)

    const [Error, setError] = useState(null);

    useEffect(() => {
        requestHandler.current = props.service.interceptors.request.use(null, error => setError(error));
        responseHandler.current = props.service.interceptors.response.use(request => request, error => setError(error));
        return () => {
            props.service.interceptors.request.eject(requestHandler.current);
            props.service.interceptors.response.eject(responseHandler.current);
        }
    }, [props.service.interceptors.request, props.service.interceptors.response])

    return (
        <Fragment>
            <Modal
                show={Error}
                close={() => setError(null)}>
                <h3>Something went wrong!</h3>
                {Error ? <p>{Error.message}</p> : null}
                <p>Please try later or if the error persist, contact an administrator</p>
            </Modal>
            {props.children}
        </Fragment>
    )
}

export default ErrorHandler;