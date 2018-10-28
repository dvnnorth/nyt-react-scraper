import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

class SiteModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteTitle: '',
      noteBody: ''
    };
  }

  handleChange = event => this.setState({ [event.target.id]: event.target.value });

  render = () => {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle}>
            {this.props.title}
          </ModalHeader>
          <ModalBody id="modalBody">
            {this.props.isNote ?
              (
                <div>
                  <FormGroup>
                    <Label for="noteTitle">Note Title:</Label>
                    <br />
                    <Input
                      type="text"
                      id="noteTitle"
                      name="title"
                      size="40"
                      defaultValue={this.props.noteTitle}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="noteBody">Note:</Label>
                    <Input
                      type="textarea"
                      id="noteBody"
                      className="form-control"
                      name="body"
                      defaultValue={this.props.body}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <span id="errorDisplay" className="text-danger"></span>
                </div>
              )
              : this.props.body}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              data-id={this.props.noteArticleId}
              onClick={
                event => {
                  this.props.buttonAction(event, this.state);
                  this.props.toggle(event);
                }
              }
            >
              {this.props.buttonActionText}
            </Button>
            {' '}
            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };
}

SiteModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  noteTitle: PropTypes.string,
  buttonAction: PropTypes.func,
  buttonActionText: PropTypes.string,
  isNote: PropTypes.bool,
  updateForm: PropTypes.func,
  noteArticleId: PropTypes.string
};

export default SiteModal;