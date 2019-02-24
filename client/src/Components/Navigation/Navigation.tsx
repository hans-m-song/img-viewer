import React from 'react';
import { Settings, ISettingsProps, ISettingsState } from './Components/Settings';

export interface INavigationProps {}

export interface INavigationState {}

export class Navigation extends React.Component<INavigationProps, INavigationState> {
    render() {
        return (
            <div className="navigation">navigation
                <Settings/>
            </div>
        );
    }
}