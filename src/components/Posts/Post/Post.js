import React from 'react';
import classes from './Post.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import CodeHiglight from '../../../assets/CodeHiglight';
import PostLogo from './PostLogo/PostLogo'
import Menu from '../../UI/Menu/Menu';
import PostTitle from './PostTitle/PostTitle';
import { connect } from 'react-redux';

const Post = React.memo((props) => {

    const canedit = () => (
        props.user && 
        (props.user.id === props.post.author.id || props.user.isAdmin)
    )

    const copyToClipboard = () => {
        const element = document.createElement('textarea');
        element.value = props.post.snippet;
        element.setAttribute('readonly', '');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
      };

    return (
        <div className={classes.Post}>
            <div className={classes.Header}>
                <PostLogo language={props.post.language.name} />
                <PostTitle
                    author={props.post.author.name}
                    published={props.post.published}>
                    <span className={classes.Title} >{props.post.title}</span>
                </PostTitle>
                {canedit() ?
                    <Menu right items={[
                        {
                            name: 'Edit',
                            action: () => props.edit(props.post.id)
                        }, {
                            name: 'Delete',
                            action: () => props.delete(props.post.id)
                        }]} /> : <div style={{marginLeft:"60px"}}/>}
            </div>
            <p>{props.post.description}</p>
            <div className={classes.Snippet}>
                <button
                    title='Copy to clipboard'
                    className={classes.CopyButton}
                    onClick={copyToClipboard} >Copy</button>
                <SyntaxHighlighter
                    language={props.post.language.name}
                    style={CodeHiglight}
                    wrapLongLines={false}>
                    {props.post.snippet}
                </SyntaxHighlighter>
            </div>
        </div >)
}, (prevProps, nextProps) => (
    prevProps.post.isEditing === nextProps.post.isEditing &&
    prevProps.post.user !== nextProps.post.user
));

const mapStateToProps = state => ({
    user : state.user.user
});

export default connect(mapStateToProps)(Post);