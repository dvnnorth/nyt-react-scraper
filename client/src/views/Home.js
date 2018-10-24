import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Container } from 'reactstrap';
import { PageTitle, ArticleCard } from '../components';

const Home = props => {
  if (!props.authenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <PageTitle pageTitle="Home" />
      <Row>
        {props.articles.map((article, i) => {
          return (
            <ArticleCard
              key={i}
              _id={article._id}
              title={article.title}
              section={article.section}
              link={article.link}
              note={article.note}
              saved={article.saved} 
            />
          );
        })}
      </Row>
    </Container>
  );
}


export default Home;