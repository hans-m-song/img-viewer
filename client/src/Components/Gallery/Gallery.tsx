import React from 'react';

import { Img, IImgProps, IImgState } from './Components/Img';

import './Gallery.scss';
import { IO, makeGetQuery, apiCall } from '../../utils';

import * as path from 'path';
// import * as fs from 'fs';

export interface IGalleryProps {
    io: IO;
    path: string;
}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {
    io: IO;

    state = {
        empty: true,
        images: [] as IImgProps[],
        dirInput: '',
    };

    constructor(props: IGalleryProps) {
        super(props);
        this.io = props.io;
    }

    componentDidMount() {
        this.fetchDir(this.props.path);
    }

    async fetchFile() {}
    async fetchDir(dirPath: string): Promise<void> {
        const url = `/api/dir?${makeGetQuery({ dir: dirPath })}`;
        let response: Response;
        try {
            response = await apiCall(url);
        } catch (err) { console.log(err) }

        const body = await response!.json();
        if (body.contents) {
            const images = body.contents.map((imageName: string) => {
                return {
                    id: imageName,
                    type: ((/cover/ig.test(imageName)) ? 'cover' : ''),
                    src: '/api/file?file=' + encodeURIComponent(path.join(dirPath, imageName)),
                };
            });

            this.setState({ images });
        }
    }

    fetchImages(): JSX.Element {
        if (this.state.images.length > 0) {
            const images = this.state.images.map((image: IImgProps) => 
                <Img
                    key={image.id}
                    src={image.src}
                    type={image.type}
                    id={image.id}
                />
            );

            return (<div className='img-array'>{images}</div>);
        }

        return (
            <div className='img-array empty'>
                <p>nothing found</p>
            </div>
        );
    }

    setDir(e: React.FormEvent): void {
        e.preventDefault();
        // TODO figure out the context of "this"
        this.fetchDir(this.state.dirInput || this.props.path);
    }

    render() {
        return (
            <div className="Gallery">

                <form className='change-directory' onSubmit={this.setDir}>
                    <p>set current directory: </p>
                    <input
                        type='text'
                        value={this.state.dirInput || this.props.path}
                        onChange={e => this.setState({ dirInput: e.currentTarget.value })}
                    />
                    <button
                        type='submit'
                        onClick={this.setDir.bind(this)}
                    >submit</button>
                </form>

                {this.fetchImages()}
                
            </div>
        );
    }
}