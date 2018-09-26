import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const SiteModal = props => (
// class SiteModal extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     modal: false,
  //     title: props.title,
  //     body: props.body,
  //     buttonAction: props.buttonAction,
  //     buttonActionText: props.buttonActionText,
  //     buttonCancelText: props.buttonCancelText || "Cancel"
  //   };

  //   this.toggle = this.toggle.bind(this);
  // };

  // toggle(value) {
  //   this.setState({
  //     modal: !this.state.modal
  //   });
  // };

  // render() {
  //   return (
      <div>
        <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
          <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
          <ModalBody>
            {props.body}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={props.toggle}>{props.buttonActionText}</Button>{' '}
            <Button color="secondary" onClick={props.toggle}>{props.buttonCancelText}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
//   }
// };

export default SiteModal;