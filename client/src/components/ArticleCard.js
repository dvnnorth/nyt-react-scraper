import React from 'react';
import PropTypes from 'prop-types';
import { Col, Card, CardBody, Button } from 'reactstrap';

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
            <Button
              color="primary"
              className="btn btn-outline-primary mt-3 mb-3 note"
              onClick={props.toggleNoteModal}
              data-id={props._id}>
              View / Edit Note
            </Button> :
            <Button
              color="secondary"
              className="btn btn-outline-secondary mt-3 mb-3 note"
              onClick={props.toggleNoteModal}
              data-id={props._id}>
              Create Note
            </Button>}
          &nbsp;&nbsp;
          {props.saved ?
            <Button
              color="danger"
              className="btn btn-outline-danger mt-3 mb-3 save"
              onClick={props.unsaveArticle}
              data-id={props._id}>
              Unsave Article
            </Button>
            : <Button
              color="success"
              className="btn btn-outline-success mt-3 mb-3 save"
              onClick={props.saveArticle}
              data-id={props._id}>
              Save Article
            </Button>}
        </div>
      </CardBody>
    </Card>
  </Col>
);

ArticleCard.propTypes = {
  section: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.string,
  note: PropTypes.string,
  toggleNoteModal: PropTypes.func,
  _id: PropTypes.string,
  createNote: PropTypes.func,
  saved: PropTypes.bool,
  saveArticle: PropTypes.func,
  unsaveArticle: PropTypes.func
};

export default ArticleCard;