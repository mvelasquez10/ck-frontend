import React from 'react'
import classes from './Spinner.module.css';

const Spinner = () => (
    <div className={classes.Loader}>
        <div className={classes.Bounce1}></div>
        <div className={classes.Bounce2}></div>
        <div className={classes.Bounce3}></div>
    </div>
);

export default Spinner;