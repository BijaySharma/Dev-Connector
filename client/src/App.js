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
// Redux
import { Provider } from 'react-redux';
import store from "./store";
import { loadUser } from './actions/auth';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';

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
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/add-education' component={AddEducation} />

          </Switch>
        </section>
        </>
      </Router>
    </Provider>
  );
};
  

export default App;
