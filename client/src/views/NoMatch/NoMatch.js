import React, { Component, Fragment } from 'react';
import API from '../../utils/API';
import { Link } from 'react-router-dom';
import './NoMatch.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        };
    }

    render() {
        return (
            <p>404 Not Found</p>
        );
    }
}

export default App;