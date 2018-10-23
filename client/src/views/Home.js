import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import API from '../utils/API';
import {
  Container
} from 'reactstrap';
import { SiteModal, PageTitle } from '../components';

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
  }

  handleScrapeArticles(event) {
    event.preventDefault();
    this.scrapeArticles();
  }

  showModal(type) {
    switch (type) {
    case 'scrape':
      this.setState({});
      return;
      break;
    case 'clear':
      //
      break;
    }
    return <SiteModal />;
  }

  render() {

    if (!this.props.authenticated) {
      return <Redirect to="/" />;
    }
    return (
      <Container>
        <PageTitle pageTitle="Home" />
        <SiteModal isOpen={this.state.modal} title="Hello" body="This is the body" buttonActionText="Do Thing" />
      </Container>
    );
  }
}

export default Home;