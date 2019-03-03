if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from './env';
import * as path from 'path';

import React from 'react';
import { Router } from 'react-router';
import { IO, makeGetQuery, apiCall } from './utils';

import './App.scss';

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
        directories: [],
        basePath: '/home/axatol/Pictures/test'
    };

    constructor (props: any) {
        super(props);
        this.setActiveGallery.bind(this);
    }

    componentDidMount(): void {
        this.statDir(this.state.basePath);
    }

    async statServer(): Promise<void> {
        const response: Response = await apiCall('/api/live');

        if (response.status !== 200 || !(/application\/json/g.test(response.headers.get('content-type') || ''))) {
            throw new Error(await response.text());
        }

        const body: any = await response.json();

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

        const url: string = '/api/dir?' + makeGetQuery({ dir: dirPath, type: 'directory' });
        let response: Response;
        try {
            response = await apiCall(url);
        } catch (err) {
            console.log(err);
            return;
        }

        const body = await response!.json();
        if (body.contents) {
            this.setState({
                directories: body.contents/*.sort((a: string, b: string): number => {
                    const getIndex = (input: string) => {
                        const matches = input.match(/\d+/g);
                        if (matches) {
                            return Number.parseInt(matches!.pop()!) || 0;
                        }
                        return 0;
                    }
                    return getIndex(a) - getIndex(b);
                })*/,
                basePath: dirPath });
        }
    }

    setDir(e: React.FormEvent): void {
        e.preventDefault();
        this.statDir(this.state.dirInput);
    }

    setActiveGallery(e: React.MouseEvent, data: any): void {
        console.log('setactivegallery');
        console.log(this.state, data)
        // this.setState({ redirectTo: '/gallery/' + data.directory });
    }

    renderGalleries(): JSX.Element {
        if (this.state.directories.length > 0) {
            const galleries: JSX.Element[] = this.state.directories.map((directory: string) => {
                const ref: React.RefObject<Gallery> = React.createRef();
                return <Gallery
                    key={directory}
                    io={this.io}
                    directory={path.join(this.state.basePath, directory)}
                    collapsed={true}
                    onClick={this.setActiveGallery.bind(this)}
                />
            });
            
            return (<div className='gallery-array'>{galleries}</div>);
        }

        return (
            <div className='gallery-array empty'>
                <p>nothing found in this directory</p>
            </div>
        );
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

                    {/* TODO integrate into navbar */}
                    <form className='change-directory' onSubmit={this.setDir}>
                        <p>set current directory: </p>
                        <input
                            type='text'
                            value={((this.state.dirInput != '') ? this.state.dirInput : this.state.basePath)}
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
