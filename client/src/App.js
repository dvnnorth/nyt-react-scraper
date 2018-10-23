import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, SavedArticles, NoMatch } from './views/index';
import './App.css';

class App extends Component {
  state = {
    authenticated: false;
  }

  componentDidMount = () => {

  }

  handleAuthenticate = () => {
    
  }

  render() {
    if (!this.state.authenticated) {
      return (

      );
    }
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/articles" component={SavedArticles} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;

