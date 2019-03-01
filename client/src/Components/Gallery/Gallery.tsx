import React from 'react';

import { Img, IImgProps, IImgState } from './Components/Img';

import './Gallery.scss';
import { IO, makeGetQuery, apiCall } from '../../utils';

import * as path from 'path';
// import * as fs from 'fs';

export interface IGalleryProps {
    io: IO;
    path: string;
    collapsed: boolean;
}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {
    io: IO;

    state = {
        images: [] as IImgProps[],
        dirInput: '',
        cover: {} as IImgProps,
        type: 'longstrip',
        collapsed: true,
    };

    constructor(props: IGalleryProps) {
        super(props);
        this.io = props.io;
    }

    componentDidMount(): void {
        this.fetchDirImages(this.props.path);
    }

    setCollapsed(value: boolean) {
        this.setState({ collapsed: value });
    }

    async fetchDirImages(dirPath: string): Promise<void> {
        const url = '/api/dir?' + makeGetQuery({ dir: dirPath, type: 'image' });
        let response: Response;
        try {
            response = await apiCall(url);
        } catch (err) {
            console.log(err);
            return;
        }

        const body = await response!.json();
        if (body.contents) {
            const images = body.contents.map((imageName: string) => {
                const imgProps = {
                    id: imageName,
                    type: ((/(0+(1|0)|cover)\.(jp(e)?g|png)/ig.test(imageName)) ? 'cover' : ''),
                    src: '/api/file?file=' + encodeURIComponent(path.join(dirPath, imageName)),
                };

                if (imgProps.type === 'cover') this.setState({ cover: imgProps });
                return imgProps
            });

            this.setState({ images });
        }
    }

    renderImages(): JSX.Element {
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
        this.fetchDirImages(this.state.dirInput || this.props.path);
    }

    handleClick(e: React.MouseEvent) {
        e.preventDefault();
        console.log('test', this);
    }

    render() {
        if (this.state.collapsed) {
            return (
                <div className="Gallery collapsed">

                    <p className='gallery-title'>{path.basename(this.props.path)}</p>

                    <div className='cover-container'>
                        {(() => {
                            if (Object.values(this.state.cover).length) {
                                return (<Img
                                    src={this.state.cover.src}
                                    type='cover'
                                    id={this.state.cover.id}
                                />);
                            }
                            return <div></div>;
                        })()}
                    </div>

                </div>
            );
        }

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

                {this.renderImages()}
                
            </div>
        );
    }
}