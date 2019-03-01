if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from './env';
import * as path from 'path';

import React, { Component, FormEvent } from 'react';

// import logo from './logo.svg';
import './normalize.css'
import './App.scss';

import { IO, makeGetQuery, apiCall } from './utils';

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
    constructor(props?: IManifest) { }
}

class App extends React.Component {
    io = new IO();

    state = {
        server: {
            status: 'offline',
            message: 'none',
        },
        serverIntervalCheck: setInterval(() => this.statServer(), 2000),
        dirInput: '',
        directories: [ '/home/axatol/Downloads' ],
        activeGallery: undefined,
        basePath: '/home/axatol/Downloads'
    };

    componentDidMount() {
        this.statDir(this.state.basePath);
    }

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

    async statDir(dirPath: string): Promise<void> {
        if (!dirPath || dirPath === '') return;

        const url = '/api/dir?' + makeGetQuery({ dir: dirPath, type: 'directory' });
        let response: Response;
        try {
            response = await apiCall(url);
        } catch (err) {
            console.log(err);
            return;
        }

        const body = await response!.json();
        if (body.contents) {
            this.setState({ directories: body.contents });
        }
    }

    setDir(e: React.FormEvent): void {
        e.preventDefault();
        this.statDir(this.state.dirInput);
    }

    setActiveGallery(e: any): void {
        console.log('test')
        console.log(e.target);
    }

    renderGalleries(): JSX.Element {
        if (this.state.activeGallery) {console.log('test')}

        const galleries: JSX.Element[] = this.state.directories.map((directory: string) => 
            <Gallery
                key={directory}
                io={this.io}
                path={path.join(this.state.basePath, directory)}
                collapsed={true}
            />
        );
        
        return (<div className='gallery-array'>{galleries}</div>);
    }

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

                {/* set root dir, set state, generate galleries */}

                <Navigation
                    io={this.io}
                />

                <div className='container'>

                    <form className='change-directory' onSubmit={this.setDir}>
                        <p>set current directory: </p>
                        <input
                            type='text'
                            value={this.state.dirInput}
                            onChange={e => this.setState({ dirInput: e.currentTarget.value })}
                        />
                        <button
                            type='submit'
                            onClick={this.setDir.bind(this)}
                        >submit</button>
                    </form>

                    {this.renderGalleries()}

                </div>

                <Footer
                />

            </div>
        );
    }
}

export default App;
