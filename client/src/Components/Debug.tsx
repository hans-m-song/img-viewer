if (process.env.NODE_ENV === 'development') require('dotenv').config();
import * as env from '../env';

import React, { Component, FormEvent } from 'react';
import { IO, makeGetQuery } from '../utils';

interface IDebugProps {
    io: IO;
}

interface IDebugState { }

interface Endpoint {
    method: string;
    route: string;
}

interface Payload {
    endpoint: Endpoint;
    data: any;
}

export class Debug extends React.Component<IDebugProps, IDebugState> {
    io: IO;
    state = {
        endpoints: [] as Endpoint[],
        response: '',
        payload: {} as Payload,
        responseToRequest: '',
        post: '',
        get: '',
    };

    constructor(props: IDebugProps) {
        super(props);
        this.io = props.io;
    }

    handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const opts = {
            method: this.state.payload.endpoint.method,
            headers: {
                'content-type': 'application/json',
            },
        }
        
        if (this.state.payload.endpoint.method === 'POST') {
            Object.assign(opts, { body: JSON.stringify({ post: this.state.payload.data }) } );
        }

        const response = await fetch(this.state.payload.endpoint.route, {
            method: this.state.payload.endpoint.method,
            headers: {
                'content-type': 'application/json',
            },
            
        });
        const body = await response.text();
        this.io.log('received response', body)
        this.setState({ responseToRequest: body });
    }

    handlePostSubmit = async (e: FormEvent<HTMLFormElement>, endpoint: string): Promise<void> => {
        e.preventDefault();
        const response = await fetch(endpoint, {
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

    handleGetSubmit = async (e: FormEvent<HTMLFormElement>, endpoint: string): Promise<void> => {
        e.preventDefault();
        const url = `${endpoint}?${makeGetQuery({ dir: this.state.get })}`
        this.io.log(url)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        const body = await response.text();
        this.io.log('received response', body);
        this.setState({ responseToRequest: body })
    }

    getEndpoints = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const response = await fetch('/api', { method: 'GET' });
        const endpoints: { endpoints: Endpoint[], message: string } = (await response.json()).endpoints;
        this.setState({ endpoints });
    }

    setEndpoint = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('setendpoint', e.target);
        this.setState({});
    }

    parseEndpoints = (): JSX.Element | undefined => {
        if (this.state.endpoints.length > 0) {
            return (
                <div className='list'>
                    {this.state.endpoints.map((endpoint: Endpoint) => <li key={endpoint.route}>{`${endpoint.route}:${endpoint.method}`}</li>)}
                </div>
            );
        }

        return;
    }

    render() {
        // TODO handle setting endpoint
        return (
            <div className='Debug'>

                <form onSubmit={this.getEndpoints}>
                    <button type='submit'>get endpoints</button>
                </form>

                {this.parseEndpoints()}

                <form onSubmit={e => this.handlePostSubmit(e, '/api/post')}>
                    <p>/api/post</p>
                    <input
                        type='text'
                        value={this.state.post}
                        onChange={e => this.setState({ post: e.target.value })}
                    />
                    <button type='submit'>submit</button>
                </form>

                <form onSubmit={e => this.handleGetSubmit(e, '/api/stat')}>
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
}