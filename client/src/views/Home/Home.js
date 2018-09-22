import React, { Component, Fragment } from 'react';
import API from '../../utils/API';
import { Link } from 'react-router-dom';
import './Home.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
  }

  render() {
    return (
      <p>This is home.</p>
    );
  }
}

export default App;