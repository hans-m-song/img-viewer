import * as path from 'path';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IO, makeGetQuery, apiCall } from '../utils';

import './Home.scss';

import { Gallery } from './index';

interface IManifest {
    alias: string;
    path: string;
    meta: object;
}

class Manifest {
    constructor(props?: IManifest) { }
}

export interface IHomeProps {
    io: IO;
}

export interface IHomeState {}

export class Home extends React.Component<IHomeProps, IHomeState> {
    io = this.props.io;

    state = {
        server: {
            status: 'offline',
            lastMessage: 'none',
        },
        serverIntervalCheck: setInterval(() => this.statServer(), 2000),
        dirInput: '',
        directories: [],
        displayType: 'directory',
        history: [],
        basePath: '/home/axatol/Pictures/test',
    };

    constructor (props: any) {
        super(props);
    }

    componentDidMount(): void {
        this.statDir(this.state.basePath);
    }

    statServer = async (): Promise<void> => {
        try {
            const response: Response = await apiCall('/api/live');
    
            const body: any = await response.json();
    
            this.setState({
                server: {
                    ...this.state.server,
                    status: 'online',
                    lastMessage: body.message,
                }
            });
        } catch (err) {
            console.log(err.message);
            this.setState({
                server: {
                    ...this.state.server,
                    status: 'offline',
                }
            });
        }
    }

    statDir = async (directory: string): Promise<void> => {
        if (!directory || directory === '') return;

        const url: string = '/api/dir?' + makeGetQuery({ dir: directory, type: 'directory' });
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
                basePath: directory,
                // history: [ ...this.state.history, directory ],
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
            });
        }
    }

    setActiveDirectory = async (e: React.MouseEvent | React.FormEvent, directory: string): Promise<void> => {
        e.preventDefault();
        const currentDir = this.state.basePath;
        await this.statDir(directory);
        if (this.state.basePath !== currentDir) {
            this.setState({ history: [ ...this.state.history, currentDir ] });
        }
        this.setState({ dirInput: '' });
    }

    back = (e: React.FormEvent): void => {
        e.preventDefault();
        if (this.state.history.length > 0) {
            const history = [ ...this.state.history ];
            const lastDirectory = history.pop();
            this.setState({ history });
            this.statDir(lastDirectory!);
        }
    }

    renderGalleries = (): JSX.Element => {
        if (this.state.displayType === 'gallery') {
            return (
                <div className='gallery-array single'>
                    <Gallery
                        io={this.io}
                        directory={this.state.basePath}
                        collapsed={false}
                        onClick={() => {}}
                    />
                </div>
            );
        }

        if (this.state.directories.length > 0) {
            const galleries: JSX.Element[] = this.state.directories.map((directory: string) => {
                const ref: React.RefObject<Gallery> = React.createRef();
                return <Gallery
                    key={directory}
                    io={this.io}
                    directory={path.join(this.state.basePath, directory)}
                    collapsed={true}
                    onClick={this.setActiveDirectory}
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

        if (this.state.server.status !== 'online') {
            return (
                <div className='Home'>
                    <div className='server-err'>
                        <p>Server is not online, waiting for backend to start</p>
                        <p>Server status: {this.state.server.status}, lastMessage: {this.state.server.lastMessage}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className='Home'>

                <form className='change-directory' onSubmit={e => this.setActiveDirectory(e, this.state.dirInput)}>
                    <p>set directory: </p>
                    <input
                        type='text'
                        value={this.state.dirInput}
                        onChange={e => this.setState({ dirInput: e.currentTarget.value })}
                    />
                    <button 
                        type='submit'>
                        submit</button>
                    <button 
                        type='submit'
                        onClick={e => {e.preventDefault();this.setState({ dirInput: this.state.basePath });}}>
                        current
                    </button>
                    <button 
                        type='submit'
                        onClick={e => {e.preventDefault();this.setState({ dirInput: '' });}}>
                        x
                    </button>
                </form>

                <form className='change-display' onSubmit={e => e.preventDefault()}>
                    <p>set directory display type: </p>
                    <select value={this.state.displayType} onChange={e => this.setState({ displayType: e.currentTarget.value })}>
                        <option value='directory'>directory</option>
                        <option value='gallery'>gallery</option>
                    </select>
                </form>

                <form className='btn-return' onSubmit={this.back}>
                    <button type='submit'>back</button>
                </form>

                {this.renderGalleries()}

            </div>
        );
    }
}
