import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header'

import BoatsList from './components/BoatsList';

class App extends Component {
  render() {
    return (
        <Router>
        <div className="container">
          <Header />
          <Route exact path="/" component={BoatsList} />
        </div>
      </Router>
    );
  }
}

export default App;
