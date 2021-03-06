import React, { useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layouts/NavBar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import Alert from './components/layouts/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
import setAuthToken from './utils/setAuthToken';
import { Provider } from 'react-redux';
import store from "./store";
import { loadUser } from './actions/auth';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/Profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  // Load the user
  useEffect(() => store.dispatch(loadUser()), []);

  return (
    <Provider store={store}>
      <Router>
        <>
        <NavBar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/add-education' component={AddEducation} />
            <PrivateRoute exact path='/posts' component={Posts} />
            <PrivateRoute exact path='/posts/:id' component={Post} />

          </Switch>
        </section>
        </>
      </Router>
    </Provider>
  );
};
  

export default App;
