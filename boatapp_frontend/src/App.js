import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BoatDetails from './components/BoatDetails'

import BoatsList from './components/BoatsList';

class App extends Component {
  render() {
    return (
      <Router>
          <Switch>
            <div className="container">
              <Route exact path="/" component={BoatsList} />
              <Route exact path="/boat/:id" component={BoatDetails} />
            </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
