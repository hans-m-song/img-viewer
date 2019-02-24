import React, { Component, FormEvent } from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  Navigation,
  Gallery,
} from './Components/index';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };

  componentDidMount() {
    (async () => {
      const response = await fetch('/api/live', { method: 'GET' });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    })()
      .then((res: any) => this.setState({ response: res.express }))
      .catch((err: any) => console.log(err));
  }

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.text();
    console.log('received response', body)
    this.setState({ responseToPost: body });
  } 

  render() {
    return (
      <div className="App">app

        <p>reponse from api/live: {this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>post to server</p>
          <input
            type='text'
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type='submit'>submit</button>
        </form>
        <p>{this.state.responseToPost}</p>

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
