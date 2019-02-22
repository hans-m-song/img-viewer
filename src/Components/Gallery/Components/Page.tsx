import React from 'react';

export interface IPageProps {}

export interface IPageState {}

export class Page extends React.Component<IPageProps, IPageState> {
    render() {
        return (
            <div className="page"></div>
        );
    }
}