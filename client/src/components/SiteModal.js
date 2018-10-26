import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const SiteModal = props => (
  <div>
    <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>
        {props.body}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={event => { props.buttonAction(event); props.toggle(); }}>{props.buttonActionText}</Button>{' '}
        <Button color="secondary" onClick={props.toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default SiteModal;