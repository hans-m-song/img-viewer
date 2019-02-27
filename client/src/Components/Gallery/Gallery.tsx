import React from 'react';

import { Img, IImgProps, IImgState } from './Components/Img';

import './Gallery.scss';
import { IO, makeGetQuery } from '../../utils';

// import * as path from 'path';
// import * as fs from 'fs';

export interface IGalleryProps {
    io: IO;
    path: string;
}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {
    io: IO;
    state = {};

    constructor(props: IGalleryProps) {
        super(props);
        this.io = props.io;
    }

    async statDir(path: string) {
        const response = await fetch(`/api/stat?${makeGetQuery({ dir: path })}`, {
            method: 'GET',
            
        });
        this.io.log(JSON.stringify(response))
    }

    componentDidMount() {
        this.statDir('/home/axatol/Pictures');
    }

    generateImages(filePath: string) {
        // filePath = path.resolve(filePath);
        // const files = fs.readdirSync(filePath).filter(file => /\.(png|gif|jp[e]?g)$/ig.test(file));
        // return files.map(file => 
        //     <Img
        //         src={path.join(filePath, file)}
        //         type={'image'}
        //         id={file.replace(/\.(png|gif|jp[e]?g)$/ig, '')}
        //     />
        // );
    }

    render() {
        return (
            <div className="Gallery">gallery
                {this.generateImages(this.props.path)}
            </div>
        );
    }
}