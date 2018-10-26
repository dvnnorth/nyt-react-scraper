import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { PageTitle } from '../components';
import API from '../utils/API';

class Login extends Component {
  state = {
    errorMessage: [],
    register: false
  };

  authenticate = () => {
    if (this.state.username && this.state.password) {
      const { username, password } = this.state;
      const login = { username, password };
      API.login(login)
        .then(res => {
          this.setState({ errorMessage: [] }, this.props.handleAuthenticated);
        })
        .catch(err => this.setState({ errorMessage: [err.toString(), 'Invalid User Name or Password'] }));
    }
    else {
      return this.setState({ errorMessage: ['Error: You must fill out both fields', ''] });
    }
  };

  register = () => {
    if (this.state.username && this.state.password) {
      const { username, password } = this.state;
      const registration = { username, password };
      API.register(registration)
        .then(res => {
          this.authenticate();
        })
        .catch(err => {
          let errMsg = '';
          if (err.toString().includes('409')) {
            errMsg = 'User already exists';
          }
          else if (err.toString().includes('500')) {
            errMsg = 'Server error';
          }
          else {
            errMsg = 'Invalid user name or password';
          }
          this.setState({ errorMessage: [err.toString(), errMsg] });
        });
    }
    else {
      return this.setState({ errorMessage: ['Error: You must fill out both fields', ''] });
    }
  };

  toggleRegister = () => this.setState({ register: !this.state.register });

  onChange = event => this.setState({ [event.target.id]: event.target.value });

  render = () => {
    if (this.props.authenticated) {
      window.scrollTo(0, 0);
      return <Redirect to="/home" />;
    }
    return (
      <Container>
        <PageTitle pageTitle={this.state.register ? "Register" : "Login"} />

        {/* Login Form */}
        <Row>
          <Col xs="4" />
          <Col xs="12" sm="4">
            <Form>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="username" className="mt-2 mr-sm-2">User Name:</Label>
                <Input type="username" name="username" id="username" placeholder="user" onChange={this.onChange} />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="password" className="mt-2 mr-sm-2">Password:</Label>
                <Input type="password" name="password" id="password" placeholder="password" onChange={this.onChange} />
              </FormGroup>
            </Form>
            <br />
            <Button onClick={this.state.register ? this.register : this.authenticate}>Submit</Button>&nbsp;&nbsp;
            <Button onClick={this.toggleRegister}>{this.state.register ? 'Login' : 'Register'}</Button>
            {
              this.state.errorMessage &&
              (
                <React.Fragment>
                  <div className="text-danger text-center pt-2">{this.state.errorMessage[0]}</div>
                  <div className="text-danger text-center pt-2">{this.state.errorMessage[1]}</div>
                </React.Fragment>
              )
            }
          </Col>
          <Col xs="4" />
        </Row>
      </Container>
    );
  };
}

export default Login;