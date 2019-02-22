import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  Navigation,
  Gallery,
} from './Components/index';

class App extends Component {
  render() {
    return (
      <div className="App">

        <Navigation
        />

        <Gallery
        />

      </div>
    );
  }
}

export default App;
