if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from './env'; 

import React, { Component, FormEvent } from 'react';

// import logo from './logo.svg';
import './normalize.css'
import './App.scss';

import {
  Navigation,
  Gallery,
} from './Components/index';

interface IIO {}

class IO {
  log(message: any, ...args: any[]) {
    console.log(message, ...args);
  }

  error(message: any, ...args: any[]) {
    console.error(message, ...args);
  }

  constructor(props?: IIO) {}
}

class App extends Component {
  io = new IO();

  state = {
    waitingForServer: true,
    server: {
      status: 'offline',
      message: 'none',
    },
    response: '',
    post: '',
    get: '',
    responseToRequest: '',
  };

  makeGetQuery(query: any) {
    return Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&')
  }

  async statServer() {
    const response: any = await fetch('/api/live/', { method: 'GET' });

    if (response.status !== 200 || !(/application\/json/g.test(response.headers.get('content-type')))) {
      throw new Error(await response.text());
    }

    const body = await response.json();

    this.setState({
      waitingForServer: false,
      server: {
        ...this.state.server,
        status: 'online',
        message: body.message,
      }
    });
  }

  async statServerApi() {
    const response: any = await fetch('/api', { method: 'GET' });

    if (response.status !== 200 || !(/application\/json/g.test(response.headers.get('content-type')))) {
      throw new Error(await response.text());
    }
    
    const body = await response.json();
    this.io.log(body);
    return body;
  }

  componentDidMount() {
    try { this.statServer(); } catch (err) { this.io.error(err) }
    try { this.statServerApi(); } catch (err) { this.io.error(err) }
  }

  handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/post/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.text();
    this.io.log('received response', body)
    this.setState({ responseToRequest: body });
  }

  handleGetSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `/api/stat?${this.makeGetQuery({ dir: this.state.get })}`
    this.io.log(url)
    const response = await fetch(url,  {
      method:'GET',
      headers: {
        'content-type': 'application/json'
      }
    });
    const body = await response.text();
    this.io.log('received response', body);
    this.setState({ responseToRequest: body })
  }

  render() {
    if (this.state.server.status != 'online') {
      return (
        <div className="App">
          <p>Server is not online, make sure backend server is running and try again</p>
          <p>Server status: {this.state.server.status}, message: {this.state.server.message}</p>
        </div>
      );
    }

    if (env.DEBUG && env.DEBUG === 'API') {
      return (
        <div className="App">
          <p>Server status: {this.state.server.status}, message: {this.state.server.message}</p>

          <form onSubmit={this.handlePostSubmit}>
            <p>api/post</p>
            <input
              type='text'
              value={this.state.post}
              onChange={e => this.setState({ post: e.target.value })}
            />
            <button type='submit'>submit</button>
          </form>

          <form onSubmit={this.handleGetSubmit}>
            <p>api/stat</p>
            <input
              type='text'
              value={this.state.get}
              onChange={e => this.setState({ get: e.target.value })}
            />
            <button type='submit'>submit</button>
          </form>

          <p>{this.state.responseToRequest}</p>
        </div>
      );
    }

    return (
      <div className="App">app

        <Navigation
        />

        <Gallery
          path='/home/axatol/Pictures'
        />

      </div>
    );
  }
}

export default App;
