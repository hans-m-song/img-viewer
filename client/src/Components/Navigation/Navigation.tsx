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

                <div className=''>header</div>

                <nav className=''>
                    <a className='' href='#'>import session</a>
                    <a className='' href='#'>export session</a>
                    <a className='' href='#'>import directory</a>
                    <a className='' href='#'>import archive</a>
                </nav>

                <Settings/>
            </div>
        );
    }
}