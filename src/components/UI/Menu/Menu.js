import React, { useRef } from 'react'
import classes from './Menu.module.css'

const Menu = props => {

    const content = useRef(null);
    let show = true;

    const contentClasses = [classes.Content];

    if (props.right) {
        contentClasses.push(classes.ContentRight);
    }

    const toggleContent = (event) => {
        if (show) {
            content.current.classList.add(classes.Display)
            event.target.classList.add(classes.Showing)
        } else {
            content.current.classList.remove(classes.Display)
            event.target.classList.remove(classes.Showing)
        }

        show = !show;
    }

    const itemAction = item => {
        item.action();
        content.current.classList.remove(classes.Display);
    }

    let selector = <button className={classes.Button} onClick={toggleContent}>···</button>
    if (props.selector) {
        selector =
            <div onClick={toggleContent}>
                {props.selector}
            </div>
    }

    return <div className={classes.Dropdown}>
        {selector}
        <div className={contentClasses.join(' ')} ref={content}>
            {props.items.map(item =>
                <span
                    key={item.name}
                    className={item.disabled ? classes.ContentDisabled : ''}
                    onClick={item.disabled ? null : () => itemAction(item)}>
                    {item.name}
                </span>
            )}
        </div>
    </div>
}

export default Menu;