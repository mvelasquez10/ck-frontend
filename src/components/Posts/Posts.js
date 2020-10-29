import React, { useState, useEffect, useRef, Suspense, Fragment, lazy } from 'react';
import Post from './Post/Post';
import Modal from '../UI/Modal/Modal';
import SideDrawer from '../UI/Navigation/SideDrawer/SideDrawer';
import classes from './Posts.module.css'
import Filters from './Filters/Filters';
import CK, * as CKService from '../../services/CK';
import ErrorHandler from '../UI/ErrorHandler/ErrorHandler';
import Spinner from '../UI/Spinner/Spinner';
import ErrorBackground from '../UI/ErrorBackgroud/ErrorBackground';
import Axios from 'axios';
import { connect } from 'react-redux';
import { resetPost } from '../../store/actions/post';
import { showConfirmAction } from '../../store/actions/UI';

const PostEditLazy = lazy(() => import('./Post/PostEdit/PostEdit'))

const Posts = props => {

    // -- Ref
    const currentPage = useRef(1);
    const scrollTop = useRef(false);
    const content = useRef(false);
    const isFetching = useRef(false);

    //-- States    
    const [currentFilterQuery, setFilterQuery] = useState(null);
    const [currentLanguages, setLanguages] = useState(null);
    const [currentAuthors, setAuthors] = useState(null);
    const [currentError, setServerError] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [currentPosts, setPosts] = useState(null);

    //-- Effects
    useEffect(() => {
        CKService.getLanguages()
            .then(response => {
                setLanguages(response.data.map(language => getFormatedLanguage(language)))
                CKService.getAuthors()
                    .then(response => {
                        setAuthors(response.data.map(author => getFormatedAuthor(author)));
                        setFilterQuery('');
                    })
                    .catch(() => { setServerError(true) })
            })
            .catch(() => { setServerError(true) })
    }, [])

    useEffect(() => {
        if (currentFilterQuery !== null) {
            updatePosts(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFilterQuery])

    useEffect(() => {
        if (props.resetPost) {
            resetPosts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.resetPost])

    useEffect(() => {
        if (currentPosts) {
            const editingPost = currentPosts.find(post => post.isEditing);
            if (editingPost) {
                cancelHandler(editingPost.id);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    //-- Handlers    
    const editHandler = id =>
        setPosts(prevState =>
            prevState.map(post => ({
                ...post,
                isEditing: post.id === id
            }))
        );

    const cancelHandler = id =>
        setPosts(prevState =>
            prevState.map(post =>
                post.id === id ?
                    {
                        ...post,
                        isEditing: false
                    } :
                    {
                        ...post
                    }
            ));

    const saveNewHandler = post => {
        setShowNewModal(false);
        CKService.postPost(post)
            .then(response => {
                if (response.status === 201) {
                    props.onResetPost(true);
                }
            })
            .catch((error) => console.log(error))
    }

    const saveHandler = post => {
        cancelHandler(post.id);
        CKService.putPost(post)
            .then(response => {
                if (response.status === 200) {
                    setPosts(prevState =>
                        prevState.map(oldPost =>
                            oldPost.id === post.id ?
                                {
                                    ...post,
                                    isEditing: false
                                } :
                                {
                                    ...oldPost
                                }
                        ));
                }
            })
            .catch((error) => console.log(error));
    }

    const deleteHandler = id => {
        let post = currentPosts.find(post => post.id === id);
        if (post) {
            post.isActive = false;
            CKService.putPost(post)
                .then(response => {
                    if (response.status === 200) {
                        setPosts(prevState => prevState.filter(oldPost => oldPost.id !== post.id));
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    const scrollHandler = event => {
        if (scrollTop.current) {
            scrollTop.current = false;
            return;
        }

        if ((event.target.scrollHeight - event.target.scrollTop).toFixed(0) <= event.target.clientHeight) {
            if (isFetching.current) {
                return;
            }

            currentPage.current += 1;
            updatePosts();
        } else if (event.target.scrollTop === 0) {
            event.target.scrollTop += 1;

            if (isFetching.current) {
                return;
            }

            if (currentPage.current > 1) {
                currentPage.current -= 1;
            }
            updatePosts(false, true);
        }
    }

    //----- Helpers
    const updatePosts = (filtering, up) => {

        //console.log(`filtering:${filtering} GoingUp:${up} Page:${currentPage.current} Filter:${currentFilterQuery}`)

        if (isFetching.current) {
            return;
        }

        isFetching.current = true;
        const page = filtering ? 1 : currentPage.current;
        const posts = currentPosts && !filtering ? [...currentPosts] : [];

        CKService.getPosts(page, currentFilterQuery)
            .then(response => {
                if (response.status === 200) {
                    return Axios.all(response.data.map(async post => {
                        let author = currentAuthors.find(author => author.id === post.author);
                        if (!author) {
                            const response = await CKService.getUser(post.author);
                            author = getFormatedAuthor(response.data);
                            setAuthors(prevState => prevState.concat(author));
                        }

                        let language = currentLanguages.find(language => language.id === post.language);
                        if (!language) {
                            const response = await CKService.getLanguage(post.language);
                            language = getFormatedAuthor(response.data);
                            setLanguages(prevState => prevState.concat(language));
                        }

                        if (!posts.find(newPost => newPost.id === post.id)) {
                            posts.push(getFormatedPost(post, author, language));
                        }
                    }))
                } else {

                    if (currentPage.current > 2) {
                        currentPage.current -= 1;
                    }

                    isFetching.current = false;
                }
            })
            .then(() => {
                const maxItems = 10;
                posts.sort((a, b) => b.id - a.id);
                if (posts.length > maxItems) {
                    const amount = posts.length - maxItems;
                    posts.splice(up ? maxItems : 0, amount);
                }
                setPosts(posts);
                if (!up) {
                    scrollTop.current = true;
                    content.current.scrollTop -= 1;
                }

                isFetching.current = false;
            })
            .catch((error) => {
                console.log(error);
                isFetching.current = false;
            });
    }

    const getFormatedPost = (post, author, language) => ({
        id: post.id,
        author: author,
        title: post.title,
        isActive: post.isActive,
        description: post.description,
        language: language,
        isEditing: false,
        published: getDateFormat(new Date(post.published)),
        snippet: post.snippet
    });

    const getNewPost = (autor, language) => ({
        id: 0,
        author: { ...autor },
        title: '',
        description: '',
        language: { ...language },
        canEdit: true,
        isEditing: false,
        published: getDateFormat(new Date(Date.now())),
        snippet: ''
    });

    const getFormatedAuthor = author => ({
        id: author.id,
        name: author.name + ' ' + author.surname
    });

    const getFormatedLanguage = language => {
        return ({
            id: language.id,
            name: language.name
        })
    }

    const resetPosts = () => {
        setFilterQuery('');
        currentPage.current = 1;
        props.onResetPost(false);
        scrollTop.current = true;
        content.current.scrollTop = 0;
        updatePosts(true);
    }

    const canAddPost = () => props.user && props.user.id && !props.user.isAdmin;

    let posts = <Spinner />
    if (currentPosts) {
        posts =
            <div className={classes.Content} style={{ height: window.innerHeight - 60 }} onScroll={scrollHandler} ref={content}>
                {canAddPost() ?
                    <Fragment>
                        <Modal noWrap show={showNewModal} close={() => setShowNewModal(false)} >
                            <Suspense
                                fallback={<Spinner />}>
                                <PostEditLazy
                                    new={showNewModal}
                                    post={getNewPost(props.user, currentLanguages[0])}
                                    languages={[...currentLanguages]}
                                    cancel={() => setShowNewModal(false)}
                                    save={saveNewHandler} />
                            </Suspense>
                        </Modal>
                        <button
                            title='Add Post'
                            className={classes.AddButton}
                            onClick={() => setShowNewModal(true)} />
                    </Fragment> : null
                }
                <SideDrawer
                    title={<h3>Filters</h3>}
                    show={showFilters}
                    close={() => setShowFilters(false)}>
                    <Filters
                        authors={currentAuthors}
                        languages={currentLanguages}
                        setFilterQuery={setFilterQuery}
                        close={() => setShowFilters(false)} />
                </SideDrawer>
                <button
                    title='Filters'
                    className={classes.FilterButton}
                    onClick={() => setShowFilters(true)} />
                {currentPosts.length > 0 ?
                    currentPosts.map(post =>
                        post.isEditing ?
                            <Suspense
                                key={post.id}
                                fallback={<Spinner />}>
                                <PostEditLazy
                                    languages={[...currentLanguages]}
                                    post={post}
                                    cancel={cancelHandler}
                                    save={saveHandler} />
                            </Suspense> :
                            <Post
                                post={post}
                                key={post.id}
                                edit={editHandler}
                                delete={() => props.onConfimAction('Are you sure you want to delete this post?', () => deleteHandler(post.id))}
                            />
                    ) : <h3>No posts!, try changing the filter</h3>}
            </div>
    } else if (currentError) {
        posts = <ErrorBackground />
    }

    return (
        <ErrorHandler service={CK}>
            {posts}
        </ErrorHandler>
    );
};

export const getDateFormat = date => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const mapPropsToState = state => ({
    user: state.user.user,
    resetPost: state.post.resetPost
})

const mapDispatchToProps = dispatch => ({
    onResetPost: set => dispatch(resetPost(set)),
    onConfimAction: (message, confim) => dispatch(showConfirmAction(message, confim))
})

export default connect(mapPropsToState, mapDispatchToProps)(Posts);

