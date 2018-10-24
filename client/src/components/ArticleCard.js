import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody } from 'reactstrap';

const ArticleCard = props => (
  <Col md="6" className="mb-4">
    <Card className="flex-md-row shadow-sm h-100">
      <CardBody className="d-flex flex-column align-items-start">
        <strong className="d-inline-block mb-2 text-primary">{props.section}</strong>
        <h3 className="card-header">
          <a className="text-dark" href={props.link}>{props.title}</a>
        </h3>
        <div>
          {props.note ?
            <Link
              className="btn btn-outline-primary mt-3 mb-3 note"
              onClick={props.viewEditNote}
              data-id={props._id}>
              View / Edit Note
            </Link> :
            <Link
              className="btn btn-outline-secondary mt-3 mb-3 note"
              onClick={props.createNote}
              data-id={props._id}>
              Create Note
          </Link>}
          {props.saved ||
            <Link
              className="btn btn-outline-success mt-3 mb-3 save"
              onClick={props.saveArticle}
              data-id={props._id}>
              Save Article
            </Link>}
        </div>
      </CardBody>
    </Card>
  </Col>
);