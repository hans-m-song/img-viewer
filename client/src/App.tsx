if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from './env';
import * as path from 'path';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IO, makeGetQuery, apiCall } from './utils';

import './App.scss';

import { Navigation, Home, Footer, Debug } from './Components/index';


interface IManifest {
    alias: string;
    path: string;
    meta: object;
}

class Manifest {
    constructor(props?: IManifest) { }
}

class App extends React.Component {
  io = new IO();  

  render() {

    return (
        <div className='App'>

            {/* set root dir, set state, generate galleries */}

            <Navigation
                io={this.io}
            />

            <Switch>
              <Route exact path='/' render={() => <Home io={this.io} />} /> 
              <Route path='/debug' render={() => <Debug io={this.io} />} />
            </Switch>

            <Footer
            />

        </div>
    );
  }
}

export default App;
