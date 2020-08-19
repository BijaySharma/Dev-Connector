import React, { useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layouts/NavBar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layouts/Alert';
import './App.css';
import setAuthToken from './utils/setAuthToken';
// Redux
import { Provider } from 'react-redux';
import store from "./store";
import { loadUser } from './actions/auth';

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
          </Switch>
        </section>
        </>
      </Router>
    </Provider>
  );
};
  

export default App;
