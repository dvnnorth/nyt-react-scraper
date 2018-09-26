import React, { Component, Fragment } from 'react';
import API from '../utils/API';
import { Link } from 'react-router-dom';

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
  }

  render() {
    return (
      <p>This is Articles.</p>
    );
  }
}

export default Articles;