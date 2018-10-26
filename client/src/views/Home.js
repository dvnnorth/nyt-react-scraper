import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Col, Row, Container } from 'reactstrap';
import { PageTitle, ArticleCard } from '../components';

const Home = props => {
  if (!props.authenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <PageTitle pageTitle="Home" />
      <Row>
        {props.articles.length === 0 ?
          (<Container>
            <Row>
              <Col xs="3" />
              <Col xs="6">
                <h3 className="text-center font-italic">No Scraped Articles!</h3>
                <br />
                <div>
                  <p className="text-center">
                    Click&nbsp;
                    <Link className="btn-link" to="" onClick={props.handleScrape}>scrape</Link>
                    &nbsp;to get some new articles.
                  </p>
                </div>
              </Col>
              <Col xs="3" />
            </Row>
          </Container>) :
          props.articles.map((article, i) => (
            <ArticleCard
              key={i}
              _id={article._id}
              title={article.title}
              section={article.section}
              link={article.link}
              note={article.note}
              saved={article.saved}
            />
          ))}
      </Row>
    </Container>
  );
};


export default Home;