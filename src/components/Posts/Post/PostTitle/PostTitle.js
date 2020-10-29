import React from 'react';
import classes from './PostTitle.module.css';

const PostTitle = props => (
    <div style={{ display: "flex-start", flexFlow: "column", width : "100%" }}>
        {props.children}
        {props.author ?
            <div className={classes.Info}>
                <p>by <b><i>{props.author}</i></b> on <b><i>{props.published}</i></b></p>
            </div> : null}
    </div>
)

export default PostTitle;