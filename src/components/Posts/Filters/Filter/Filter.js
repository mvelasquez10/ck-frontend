import React from 'react'
import Menu from '../../../UI/Menu/Menu';
import classes from './Filter.module.css'

const Filter = React.memo(props => {

    const setFilter = value =>
        props.setFilter({
            ...props.filter,
            value: value
        });

    return (
        <div className={classes.Filter}>
            <div className={classes.Title}>
                {props.filter.name}    
                <button
                        style={props.filter.value ? {} : { display: 'none' }}
                        className={classes.ResetButton}
                        onClick={() => setFilter(null)}>X</button>
            </div>
            {props.filter.items ?
                <Menu
                    selector={<button style={{ margin: "5px 0 0 0", width: '100%' }}>{
                        props.filter.value ?
                            props.filter.items[props.filter.value - 1].name :
                            'All'}</button>}
                    items={
                        props.filter.items.map(language => ({
                            name: language.name,
                            action: () => setFilter(language.id)
                        }))} /> :
                <input
                    type='text'
                    value={props.filter.value ? props.filter.value : ''}
                    onChange={event => setFilter(event.target.value)} />                
            }
        </div>
    )
}, (prevProps, nextProps) => prevProps.filter.value === nextProps.filter.value)

export default Filter;