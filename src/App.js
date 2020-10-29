import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Layout from './components/Layout/Layout';
import Posts from './components/Posts/Posts';
import { logIn } from './store/actions/user';

const App = props => {
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user) {
      props.onLogin(JSON.parse(user));
    }
  }, [props])

  return (
    <div >
      <Layout>
        <Posts />
      </Layout>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  onLogin : (user) => dispatch(logIn(user))
})

export default connect(null, mapDispatchToProps)(App);
