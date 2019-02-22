import React from 'react';
import { Page, IPageProps, IPageState } from './Components/Page';

export interface IGalleryProps {}

export interface IGalleryState {}

export class Gallery extends React.Component<IGalleryProps, IGalleryState> {
    render() {
        return (
            <div className="gallery">
                <Page />
            </div>
        );
    }
}