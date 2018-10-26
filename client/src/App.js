import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, SavedArticles, Login, NoMatch } from './views/index';
import './App.css';
import { Container, Jumbotron, Button } from 'reactstrap';
import { TopNav, SiteModal } from './components';
import API from './utils/API';
import modaldata from './data/modalData.json';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: {},
      modal: false,
      modalContents: {},
      articles: [],
      savedArticles: []
    };

    // Populate articles and saved articles with data from database
    API.articles()
      .then(response => {
        this.setState({ articles: [...response.data] },
          () => {
            API.savedArticles()
              .then(response => {
                this.setState({ savedArticles: [...response.data] });
              })
              .catch(err => API.log({ level: 'error', message: err.toString() }));
          });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  }

  handleAuthenticated = () => this.setState({ authenticated: true });

  handleLogOut = () => this.setState({ authenticated: false });

  toggleModal = modalContents => {
    this.setState({
      modalContents: { ...modalContents }
    }, this.setState({ modal: !this.state.modal }));
  };

  handleScrapeArticles = event => {
    event.preventDefault();
    API.scrapeArticles()
      .then(response => {
        this.setState({ articles: [...response.data] });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleClearArticles = event => {
    event.preventDefault();
    API.clearArticles()
      .then(_ => {
        this.setState({ articles: [] });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          <Container>
            {this.state.authenticated && <TopNav handleScrape={() => this.toggleModal(modaldata.scrapeModalData)} handleClear={() => this.toggleModal(modaldata.clearModalData)} />}
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
                <Route path="/home" component={() => <Home authenticated={this.state.authenticated} handleScrape={() => this.toggleModal(modaldata.scrapeModalData)} articles={this.state.articles} />} />
                <Route path="/articles" component={() => <SavedArticles authenticated={this.state.authenticated} articles={this.state.savedArticles} />} />
                <Route component={NoMatch} />
              </Switch>
            </main>
          </Container>
        </Router>
        <Button onClick={this.toggleModal}>Modal</Button>
        <SiteModal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          title={this.state.modalContents.title}
          body={this.state.modalContents.body}
          buttonActionText={this.state.modalContents.buttonActionText}
          buttonAction={
            this.state.modalContents.buttonActionText === 'Scrape' ?
              this.handleScrapeArticles : this.handleClearArticles
          }
        />
      </React.Fragment>
    );
  }
}

export default App;

