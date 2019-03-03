import * as path from 'path';

import React from 'react';
import { IO, makeGetQuery, apiCall } from '../../utils';
import { Img, IImgProps, IImgState } from './Components/Img';

import './Gallery.scss';

export interface IGalleryProps {
    io: IO;
    directory: string;
    collapsed: boolean;
    onClick(e: React.MouseEvent, data: any): void;
}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {

    io: IO;

    state = {
        images: [] as IImgProps[],
        dirInput: '',
        cover: {} as IImgProps,
        type: 'longstrip',
    };

    constructor(props: IGalleryProps) {
        super(props);
        this.io = props.io;
    }

    componentDidMount(): void {
        this.fetchDirImages(this.props.directory);
    }

    async fetchDirImages(directory: string): Promise<void> {
        const url: string = '/api/dir?' + makeGetQuery({ dir: directory, type: 'image' });
        let response: Response;
        try {
            response = await apiCall(url);
        } catch (err) {
            console.log(err);
            return;
        }

        const body: any = await response!.json();
        if (body.contents && body.contents.length > 0) {
            const images = body.contents.map((imageName: string) => {
                const imgProps: IImgProps = {
                    id: imageName,
                    type: '',
                    src: '/api/file?file=' + encodeURIComponent(path.join(directory, imageName)),
                };

                return imgProps;
            });

            const cover = {
                id: body.contents[0],
                type: 'cover', // ((/(0+1|cover).*\.(jp(e)?g|png)/ig.test(imageName)) ? 'cover' : '')
                src: '/api/file?file=' + encodeURIComponent(path.join(directory, `${body.contents[0]}`))
            };

            this.setState({ images, cover });
        }
    }

    renderImages(): JSX.Element {
        if (this.state.images.length > 0) {
            const images: JSX.Element[] = this.state.images.map((image: IImgProps) => 
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
        this.fetchDirImages(this.state.dirInput || this.props.directory);
    }

    handleClick(e: React.MouseEvent) {
        e.preventDefault();
        console.log('test', this);
    }

    render() {
        if (this.props.collapsed) {
            return (
                <div className="Gallery collapsed" onClick={e => this.props.onClick(e, { directory: this.props.directory })}>

                    {(() => {
                        const title = path.basename(this.props.directory);
                        const matches = title.match(/\d+/g);
                        if (matches) {
                            return (
                                <div className='gallery-header'>
                                    <p className='title'>{title}</p>
                                    <p className='index'>{matches.pop()}</p>
                                </div>
                            );
                        }
                        return (
                            <div className='gallery-header'>
                                <p className='title'>{title}</p>
                            </div>);
                    })()}
                        
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
                        value={this.state.dirInput || this.props.directory}
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