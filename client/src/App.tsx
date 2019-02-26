if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from './env'; 

import React, { Component, FormEvent } from 'react';

// import logo from './logo.svg';
import './normalize.css'
import './App.scss';

import { IO, makeGetQuery } from './utils';

import {
  Navigation,
  Gallery,
  Footer,
  Debug,
} from './Components/index';

interface IManifest {
  alias: string;
  path: string;
  meta: object;
}

class Manifest {
  constructor(props?: IManifest) {}
}

class App extends React.Component{
  io = new IO();

  state = {
    server: {
      status: 'offline',
      message: 'none',
    },
    serverIntervalCheck: setInterval(() => this.statServer(), 2000),
  };


  async statServer(): Promise<void> {
    const response: any = await fetch('/api/live/', { method: 'GET' });

    if (response.status !== 200 || !(/application\/json/g.test(response.headers.get('content-type')))) {
      throw new Error(await response.text());
    }

    const body = await response.json();

    this.setState({
      server: {
        ...this.state.server,
        status: 'online',
        message: body.message,
      }
    });
  }

  componentDidMount() {}

  render() {

    if (this.state.server.status === 'online') {
      clearInterval(this.state.serverIntervalCheck);
    }

    if (this.state.server.status !== 'online') {
      return (
        <div className='App'>
          <div className='server-err'>
            <p>Server is not online, waiting for backend to start</p>
            <p>Server status: {this.state.server.status}, message: {this.state.server.message}</p>
          </div>
        </div>
      );
    }

    if (env.DEBUG && env.DEBUG === 'API') {
      return (
        <div className='App'>
          
          <Debug
            io={this.io}
          />

        </div>
      );
    }

    return (
      <div className='App'>

        <Navigation
        />

        <Gallery
          path='/home/axatol/Pictures'
        />

        <Footer
        />

      </div>
    );
  }
}

export default App;
