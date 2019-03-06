import React from 'react';

import { Settings, ISettingsProps, ISettingsState } from './Components/Settings';

import './Navigation.scss';
import { IO } from '../../utils';

export interface INavigationProps {
    io: IO;
}

export interface INavigationState {}

export class Navigation extends React.Component<INavigationProps, INavigationState> {
    render() {
        return (
            <div className="Navigation">

                <div className=''>banner</div>

                <Settings/>
            </div>
        );
    }
}