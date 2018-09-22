import React, { Component } from 'react';
import API from '../../utils/API';
import {
  Container,
  Jumbotron
} from 'reactstrap';
import { SiteModal, PageTitle, TopNav, ArticleCard } from '../../components';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      modal: false
    };
  }

  scrapeArticles() {
    API.scrapeArticles()
      .then(articles => {
        this.setState({ articles });
      })
      .catch(err => console.log(err));
  };

  handleScrapeArticles(event) {
    event.preventDefault();
    this.scrapeArticles();
  };

  showModal(type) {
    switch (type) {
      case 'scrape':
        this.setState({})
        return 
        break;
      case 'clear':
        //
        break;
    }
    return <SiteModal />
  };

  render() {
    return (
      <Container>
        <TopNav />
        <Jumbotron className="p-3 p-md-5 text-white rounded bg-dark splash">
          <div class="col-md-6 px-0">
            <h1 class="display-4 font-italic">React News Scraper</h1>
            <p class="lead my-3">A New York Times news scraper using the MERN stack</p>
          </div>
        </Jumbotron>
        <main className="row mb-2">
          <PageTitle pageTitle="Home" />
        </main>
        <SiteModal isOpen={this.state.modal} title="Hello" body="This is the body" buttonActionText="Do Thing" />
      </Container>
    );
  }
}

export default Home;