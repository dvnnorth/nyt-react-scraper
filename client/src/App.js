import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Home, SavedArticles, Login, NoMatch } from './views/index';
import './App.css';
import {
  Container,
  Jumbotron
} from 'reactstrap';
import { TopNav } from './components';

class App extends Component {
  state = {
    authenticated: true
  }

  componentDidMount = () => {

  }

  onUpdate = event => {
    event.preventDefault();
    console.log(event.target);
    this.setState({});
  }

  handleAuthenticate = event => {
    event.preventDefault();
  }

  render() {
    return (
      <Router>
        <Container>
          <TopNav />
          <Jumbotron className="p-3 p-md-5 text-white rounded bg-dark splash">
            <div className="col-md-6 px-0">
              <h1 className="display-4 font-italic">React News Scraper</h1>
              <p className="lead my-3">A New York Times news scraper using the MERN stack</p>
            </div>
          </Jumbotron>
          <main className="row mb-2">
            {/* Insert switch here to render views */}
            <Switch>
              <Route path="/" exact component={() => {
                return <Login 
                  onUpdate={this.onUpdate}
                  handleAuthenticate={this.handleAuthenticate} 
                />
              }} />
              <Route path="/home" component={() => <Home authenticated={this.state.authenticated} />} />
              <Route path="/articles" component={() => <SavedArticles authenticated={this.state.authenticated} />} />
              <Route component={NoMatch} />
            </Switch>
          </main>
        </Container>
      </Router>
    );
  }
}

export default App;

