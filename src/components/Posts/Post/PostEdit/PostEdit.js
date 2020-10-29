import React, { useState, useEffect, useRef } from 'react';
import postClasses from '../Post.module.css';
import classes from './PostEdit.module.css';
import Menu from '../../../UI/Menu/Menu';
import PostLogo from '../PostLogo/PostLogo';
import PostTitle from '../PostTitle/PostTitle';

const PostEdit = props => {
    const tittleRef = useRef(null);
    const descriptionRef = useRef(null);

    const [currentPost, setPost] = useState(props.post);
    const [SaveDisabled, setSaveDisabled] = useState(false);

    useEffect(() => {
        if (props.new) {
            setSaveDisabled(true);
            setPost({ ...props.post });
            tittleRef.current.classList.remove(classes.Invalid);
            descriptionRef.current.classList.remove(classes.Invalid);
        }
    }, [props.new, props.post])

    const checkSaveDisabled = (event, post) => {
        if (event.target.value.trim().length === 0) {
            event.target.classList.add(classes.Invalid);
        } else {
            event.target.classList.remove(classes.Invalid);
        }

        setSaveDisabled(
            post.title.trim().length === 0 ||
            post.description.trim().length === 0 ||
            post.snippet.trim().length === 0
        );
    }

    const languageChangeHandler = id =>
        setPost(prevState => {
            return {
                ...prevState,
                language: props.languages.find(language => language.id === id)
            }
        });

    const titleChangeHandler = event =>
        setPost(prevState => {
            const newPost = {
                ...prevState,
                title: event.target.value
            }
            checkSaveDisabled(event, newPost);
            return newPost;
        });

    const descriptionChangeHandler = event =>
        setPost(prevState => {
            const newPost = {
                ...prevState,
                description: event.target.value
            }
            checkSaveDisabled(event, newPost);
            return newPost;
        });

    const snippetChangeHandler = event =>
        setPost(prevState => {
            const newPost = {
                ...prevState,
                snippet: event.target.value
            }
            checkSaveDisabled(event, newPost);
            return newPost;
        });

    const tabHandler = event => {
        if (event.key === "Tab") {
            event.preventDefault();
            var pos = event.target.selectionStart;
            event.target.value = event.target.value.substring(0, pos) + "\t" + event.target.value.substring(pos);
            event.target.selectionEnd = pos + 1;
        }
    }

    return (
        <div className={postClasses.Post}>
            <div className={postClasses.Header}>
                <div className={classes.Language}>
                    <PostLogo language={currentPost.language.name} />
                    {
                        <Menu
                            selector={<button style={{ margin: "5px 0 0 0" }}>{currentPost.language.name}</button>}
                            items={
                                props.languages.map(language => ({
                                    name: language.name,
                                    disabled: false,
                                    action: () => languageChangeHandler(language.id)
                                }))} />
                    }
                </div>
                <PostTitle
                    author={!props.new ? currentPost.author.name : null}
                    published={currentPost.published}>
                    <textarea
                        ref={tittleRef}
                        placeholder='Awesome title goes here!'
                        rows='2'
                        className={postClasses.Title}
                        title={currentPost.title}
                        value={currentPost.title}
                        onChange={titleChangeHandler} />
                </PostTitle>
                <div style={{marginLeft:"60px"}}/>
            </div>
            <p><textarea
                ref={descriptionRef}
                placeholder='Awesome description goes here!'
                rows='2'
                className={postClasses.Description}
                title={currentPost.description}
                value={currentPost.description}
                onChange={descriptionChangeHandler} /></p>
            <textarea
                placeholder='Awesome snippet goes here!'
                rows="10"
                className={classes.Snippet}
                title={currentPost.snippet}
                value={currentPost.snippet}
                onChange={snippetChangeHandler}
                onKeyDown={tabHandler}>
                {currentPost.snippet}
            </textarea>
            <div>
                <button disabled={SaveDisabled} onClick={() => props.save(currentPost)}>save</button>
                <button onClick={() => props.cancel(currentPost.id)}>cancel</button>
            </div>
        </div>);
};

export default PostEdit;