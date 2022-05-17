import React, { Component } from "react";
import "./App.css";
import MyRouts from "./routers/routes";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <MyRouts />
      </div>
    );
  }
}

export default App;
