import React from 'react';

export interface ISettingsProps {}

export interface ISettingsState {}

export class Settings extends React.Component<ISettingsProps, ISettingsState> {
    render() {
        return (
            <div className="Settings">settings</div>
        );
    }
}