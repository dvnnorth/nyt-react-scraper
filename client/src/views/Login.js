import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { PageTitle } from '../components';
import API from '../utils/API';

class Login extends Component {
  state = {
    errorMessage: ''
  };

  authenticate = event => {
    event.preventDefault();
    if (this.state.username && this.state.password) {
      const { username, password } = this.state;
      const login = { username, password };
      console.log(login)
      API.login(login)
        .then(res => {
          this.setState({ errorMessage: '' }, this.props.handleAuthenticated);
        })
        .catch(err => this.setState({ errorMessage: err.toString() + ' - Invalid User Name or Password' }));
    }
    else {
      console.log('not good');
      return this.setState({ errorMessage: 'Error: You must fill out both fields' });
    }
  };

  onChange = event => this.setState({ [event.target.id]: event.target.value });

  render = () => {
    if (this.props.authenticated) return <Redirect to="/home" />;
    return (
      <Container>
        <PageTitle pageTitle="Login" />

        {/* Login Form */}
        <Row>
          <Col xs="4" />
          <Col xs="12" sm="4">
            <Form>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="username" className="mr-sm-2">User Name:</Label>
                <Input type="username" name="username" id="username" placeholder="username" onChange={this.onChange} />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="password" className="mr-sm-2">Password:</Label>
                <Input type="password" name="password" id="password" placeholder="password" onChange={this.onChange} />
              </FormGroup>
            </Form>
            <br />
            <Button onClick={this.authenticate}>Submit</Button>
            {this.state.errorMessage && <div className="text-danger text-center pt-2">{this.state.errorMessage}</div>}
          </Col>
          <Col xs="4" />
        </Row>
      </Container>
    );
  };
}

export default Login;