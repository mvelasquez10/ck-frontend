import React, { Fragment, useState } from 'react'
import Filter from './Filter/Filter';
import * as CKService from '../../../services/CK';

const Filters = props => {

    const [currentFilters, setFilters] = useState([
        {
            id: 1,
            name: "Language",
            value: null,
            items: props.languages
        },
        {
            id: 2,
            name: "Title",
            value: null
        },
        {
            id: 3,
            name: "Author",
            value: null,
            specialQuery: true
        }
    ]);

    const setFiltersHandle = () => {
        const queries = currentFilters
            .filter(filter => filter.value && !filter.specialQuery)
            .map(filter => {
                switch (filter.id) {
                    case 1:
                        return 'language=' + filter.value;
                    case 2:
                        return 'title=' + filter.value;
                    default:
                        throw Error('filter not implemented');
                }
            })

        let promise = null

        const specialQuery = currentFilters.find(filter => filter.value && filter.specialQuery)
        if (specialQuery) {
            const checkAuthorNameCache = name => {
                return props.authors.find(author =>
                    author.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
            }
            
            const author = checkAuthorNameCache(specialQuery.value);
            if (author) {
                queries.push('author=' + author.id);
            } else {
                promise = CKService.getPostByAuthorNameAndSurname(specialQuery.value);
            }
             
        }

        if (promise) {
            promise.then(response => {
                queries.push(response.data);
                updateFilterQuery(queries);
            }).catch((error) => console.log(error))
        } else {
            updateFilterQuery(queries);
        }
    }

    const updateFilterQuery = queries => {
        if (queries) {
            let newQuery = '';
            queries.forEach(query => newQuery += (newQuery ? '&' : '?') + query);
            props.setFilterQuery(newQuery);
        }
    }

    const setFilterHandler = filter =>
        setFilters(prevState =>
            prevState.map(oldFilter =>
                oldFilter.id === filter.id ?
                    {
                        ...filter
                    } :
                    {
                        ...oldFilter
                    }
            ));


    return (
        <Fragment>
            {currentFilters.map(f => <Filter key={f.id} filter={f} setFilter={setFilterHandler} />)}
            <button
                style={{ alignSelf: 'center', display: 'flex' }}
                onClick={() => {
                    setFiltersHandle();
                    props.close();
                }}>Apply</button>
        </Fragment>
    )
}

export default Filters;