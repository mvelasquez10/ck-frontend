import React from 'react'
import classes from './PostLogo.module.css';
import defaultLogo from '../../../../assets/images/default.png';
import pythonLogo from '../../../../assets/images/python.png';
import csharpLogo from '../../../../assets/images/csharp.png';
import javascriptLogo from '../../../../assets/images/javascript.png';
import javaLogo from '../../../../assets/images/java.png';

const PostLogo = props => {

    const getLogo = name => {
        switch (name) {
            case "python":
                return pythonLogo;
            case "csharp":
                return csharpLogo;
            case "javascript":
                return javascriptLogo;
            case "java":
                return javaLogo;
            default:
                return defaultLogo;
        }
    }

    return (
        <img className={classes.Logo} src={getLogo(props.language)} alt="logo" />
    );
}

export default PostLogo;