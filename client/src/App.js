import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, SavedArticles, Login, NoMatch } from './views/index';
import './App.css';
import { Container, Jumbotron } from 'reactstrap';
import { TopNav, SiteModal } from './components';
import API from './utils/API';
import modaldata from './data/modalData.json';

class App extends Component {

  state = {
    authenticated: false,
    user: {},
    modal: false,
    modalContents: {},
    noteModal: false,
    noteModalTitle: '',
    noteTitle: '',
    noteBody: '',
    noteArticleId: '',
    articles: [],
    savedArticles: []
  };

  handleAuthenticated = () => this.handleGetArticles({ authenticated: true });

  handleLogOut = () => this.setState({ authenticated: false });

  toggleModal = modalContents => {
    this.setState({
      modalContents: { ...modalContents }
    }, this.setState({ modal: !this.state.modal }));
  };

  activateNoteModal = event => {
    event.preventDefault();
    let id = event.target.dataset.id;
    API.getArticleWithNote(id)
      .then(response => {
        const newState = {};
        newState.noteModalTitle = response.data.title;
        newState.noteModal = true;
        newState.noteArticleId = id;
        if (response.data.note) {
          newState.noteTitle = response.data.note.title;
          newState.noteBody = response.data.note.body;
        }
        else {
          newState.noteTitle = '';
          newState.noteBody = '';
        }
        this.setState({ ...newState });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  closeNoteModal = event => {
    event.preventDefault();
    this.setState({ noteModal: false });
  };

  handleUpdateForm = event => this.setState({ [event.target.id]: event.target.value });

  handleSaveNote = event => {
    event.preventDefault();
    const noteData = {
      title: this.state.noteTitle,
      body: this.state.noteBody
    };
    API.addUpdateNote(event.target.dataset.id, noteData)
      .then(() => {
        this.setState({ noteModal: false }, () => this.handleGetArticles());
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleScrapeArticles = event => {
    event.preventDefault();
    API.scrapeArticles()
      .then(response => {
        this.setState({ articles: [...response.data] });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleGetArticles = newState => {
    // Populate articles and saved articles with data from database
    API.articles()
      .then(response => {
        this.setState({ articles: [...response.data] },
          () => {
            API.savedArticles()
              .then(response => {
                this.setState({ savedArticles: [...response.data], ...newState });
              })
              .catch(err => API.log({ level: 'error', message: err.toString() }));
          });
      })
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleSaveArticle = event => {
    event.preventDefault();
    API.saveArticle(event.target.dataset.id)
      .then(() => this.handleGetArticles())
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleUnsaveArticle = event => {
    event.preventDefault();
    API.unsaveArticle(event.target.dataset.id)
      .then(() => this.handleGetArticles())
      .catch(err => API.log({ level: 'error', message: err.toString() }));
  };

  handleClearArticles = event => {
    event.preventDefault();
    API.clearArticles()
      .then(() => {
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
                <Route
                  path="/"
                  exact
                  component={
                    () => <Login
                      authenticated={this.state.authenticated}
                      handleAuthenticated={this.handleAuthenticated}
                    />
                  }
                />
                <Route
                  path="/home"
                  component={
                    () => <Home
                      authenticated={this.state.authenticated}
                      handleScrape={() => this.toggleModal(modaldata.scrapeModalData)}
                      articles={this.state.articles}
                      saveArticle={this.handleSaveArticle}
                      unsaveArticle={this.handleUnsaveArticle}
                      toggleNoteModal={this.activateNoteModal}
                    />
                  }
                />
                <Route
                  path="/articles"
                  component={
                    () => <SavedArticles
                      authenticated={this.state.authenticated}
                      articles={this.state.savedArticles}
                      saveArticle={this.handleSaveArticle}
                      unsaveArticle={this.handleUnsaveArticle}
                      toggleNoteModal={this.activateNoteModal}
                    />
                  }
                />
                <Route component={NoMatch} />
              </Switch>
            </main>
          </Container>
        </Router>
        {/* Scrape and Clear modal */}
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
          isNote={false}
        />
        {/* Create and edit note modal */}
        <SiteModal
          isOpen={this.state.noteModal}
          toggle={this.closeNoteModal}
          title={this.state.noteModalTitle}
          noteTitle={this.state.noteTitle}
          body={this.state.noteBody}
          buttonActionText={'Save Note'}
          buttonAction={this.handleSaveNote}
          isNote={true}
          updateForm={this.handleUpdateForm}
          noteArticleId={this.state.noteArticleId}
        />
      </React.Fragment>
    );
  }
}

export default App;

