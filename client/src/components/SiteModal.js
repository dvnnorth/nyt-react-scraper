import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

const SiteModal = props => (
  <div>
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      className={props.className}
    >
      <ModalHeader toggle={props.toggle}>
        {props.title}
      </ModalHeader>
      <ModalBody id="modalBody">
        {props.isNote ?
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
                  value={props.noteTitle}
                  onChange={props.updateForm}
                />
              </FormGroup>
              <FormGroup>
                <Label for="noteBody">Note:</Label>
                <Input
                  type="textarea"
                  id="noteBody"
                  className="form-control"
                  name="body"
                  value={props.body}
                  onChange={props.updateForm}
                />
              </FormGroup>
              <span id="errorDisplay" className="text-danger"></span>
            </div>
          )
          : props.body}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          data-id={props.noteArticleId}
          onClick={
            event => {
              props.buttonAction(event);
              props.toggle(event);
            }
          }
        >
          {props.buttonActionText}
        </Button>
        {' '}
        <Button color="secondary" onClick={props.toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
);

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