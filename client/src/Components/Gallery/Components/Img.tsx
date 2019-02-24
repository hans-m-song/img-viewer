import React from 'react';

export interface IImgProps {
    type: string;
    id: string;
    src: string;
}

export interface IImgState {}

export class Img extends React.Component<IImgProps, IImgState> {
    constructor(props: IImgProps) {
        super(props);
        this.state = {} as IImgState;
    }

    render() {

        if (this.props.type === 'cover') return (
            <img 
                className={`img ${this.props.type}`} 
                src={this.props.src} 
                alt={`image-${this.props.id}`}
            />
        );
        
        return (
            <img 
                className={`img default`} 
                src={this.props.src} 
                alt={`image-${this.props.id}`}
            />
        );
    }
}