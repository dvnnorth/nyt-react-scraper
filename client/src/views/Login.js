import React from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { PageTitle } from '../components';

const Login = props => (
  <Container>
    <PageTitle pageTitle="Login" />

    {/* Login Form */}
    <Row>
      <Col xs="4" />
      <Col xs="12" sm="4">
        <Form>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="username" className="mr-sm-2">User Name:</Label>
            <Input type="username" name="username" id="username" placeholder="username" onUpdate={props.onUpdate}/>
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="password" className="mr-sm-2">Password:</Label>
            <Input type="password" name="password" id="password" placeholder="password" onUpdate={props.onUpdate}/>
          </FormGroup>
          <br />
          <Button onSubmit={props.handleAuthenticate}>Submit</Button>
        </Form>
      </Col>
      <Col xs="4" />
    </Row>
  </Container>
);

export default Login;