import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, SavedArticles, Login, NoMatch } from './views/index';
import './App.css';
import { Container, Jumbotron, Button } from 'reactstrap';
import { TopNav, SiteModal } from './components';
import API from './utils/API';

class App extends Component {
  state = {
    authenticated: false,
    user: {},
    modal: false,
    articles: []
  };

  componentDidMount = () => {

  };

  handleAuthenticated = () => this.setState({ authenticated: true });

  handleLogOut = () => this.setState({ authenticated: false });

  toggleModal = modalContents => {
    this.setState({ modal: !this.state.modal });
  };

  scrapeArticles = () => {

  };

  handleScrapeArticles = event => {
    event.preventDefault();
    API.scrapeArticles()
      .then(response => {
        console.log(response.data)
        this.setState({ articles: [...response.data] });
      })
      .catch(err => console.log(err));
  };

  handleClearArticles = event => {
    event.preventDefault();
    API.clearArticles()
      .then(response => {

      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          <Container>
            {this.state.authenticated && <TopNav handleScrape={this.handleScrapeArticles} handleClear={this.handleClearArticles} />}
            <Jumbotron className="p-3 p-md-5 text-white rounded bg-dark splash">
              <div className="col-md-6 px-0">
                <h1 className="display-4 font-italic">React News Scraper</h1>
                <p className="lead my-3">A New York Times news scraper using the MERN stack</p>
              </div>
            </Jumbotron>
            <main className="row mb-2">
              {/* Insert switch here to render views */}
              <Switch>
                <Route path="/" exact component={() => <Login authenticated={this.state.authenticated} handleAuthenticated={this.handleAuthenticated} />} />
                <Route path="/home" component={() => <Home authenticated={this.state.authenticated} articles={this.state.articles} />} />
                <Route path="/articles" component={() => <SavedArticles authenticated={this.state.authenticated} />} />
                <Route component={NoMatch} />
              </Switch>
            </main>
          </Container>
        </Router>
        <Button onClick={this.toggleModal}>Modal</Button>
        <SiteModal isOpen={this.state.modal} toggle={this.toggleModal} title="Hello" body="This is the body" buttonActionText="Do Thing" />
      </React.Fragment>
    );
  }
}

export default App;

