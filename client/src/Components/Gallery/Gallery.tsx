import React from 'react';

import { Img, IImgProps, IImgState } from './Components/Img';

import './Gallery.scss';

// import * as path from 'path';
// import * as fs from 'fs';

export interface IGalleryProps {
    path: string;
}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {
    constructor(props: IGalleryProps) {
        super(props);

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