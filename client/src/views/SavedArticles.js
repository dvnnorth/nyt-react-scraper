import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Col, Row, Container } from 'reactstrap';
import { PageTitle, ArticleCard } from '../components';

const SavedArticles = props => {
  if (!props.authenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <PageTitle pageTitle="Saved Articles" />
      <Row>
        {props.articles.length === 0 ?
          (<Container>
            <Row>
              <Col xs="3" />
              <Col xs="6">
                <h3 className="text-center font-italic">No Saved Articles!</h3>
                <br />
                <div>
                  <p className="text-center">
                    Go to your <Link to="/home" className="btn-link">home page</Link> to save some articles.
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


export default SavedArticles;