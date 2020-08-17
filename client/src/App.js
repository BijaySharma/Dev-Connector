import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import NavBar from './components/layouts/NavBar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Router>
      <>
      <NavBar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </section>
      </>
    </Router>
  </Provider>
);

export default App;
