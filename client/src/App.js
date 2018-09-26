import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, SavedArticles, NoMatch } from './views/index';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/articles" component={SavedArticles} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;

