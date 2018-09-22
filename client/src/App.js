import React, { Component, Fragment } from 'react';
import API from './utils/API';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, Articles, NoMatch } from './views/index';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
    API.scrapeArticles()
      .then(res => this.setState({ articles: res.data }));
  }

  render() {
    const Test = props => (
      <Fragment>
        {this.state.articles.map(article => (<p>{article.saved}, {article._id}, {article.title}, {article.section}, {article.link}, {article.note}</p>))}
      </Fragment>
    );
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/test" component={Test} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
