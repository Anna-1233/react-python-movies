import React from 'react';
import './Loader.css';

export default function Loader({text}) {
    return (
        <div className="loading-container">
            <div className="lds-ellipsis">
                <div></div><div></div><div></div><div></div>
            </div>
            <p className="loading-text">{text || "Loading..."}</p>
        </div>
    );
}
