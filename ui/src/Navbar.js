import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlus, faFilm, faUserGroup, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

export default function Navbar({
    currentView,
    setCurrentView,
    searchTerm,
    setSearchTerm,
    selectedMovieIds,
    selectedActorIds,
    deleteSelectedMovies,
    deleteSelectedActors
}) {
    return (
        <nav className="manager-panel">
            <div className="panel-brand">
                <img src="/favicon.ico" alt="logo" style={{ width: '15px', marginRight: '10px' }} />
                My Movies Manager
            </div>
            <div className="panel-actions">
                <button
                    className={currentView === 'movies' ? "active" : ""}
                    onClick={() => {
                        setSearchTerm("");
                        setCurrentView('movies');
                    }}>
                    <FontAwesomeIcon icon={faFilm}/> Movies
                </button>
                <button
                    className={currentView === 'add-movie' ? "active" : ""}
                    onClick={() => {
                        setSearchTerm("");
                        setCurrentView('add-movie');
                    }}>
                    <FontAwesomeIcon icon={faCirclePlus}/> Add Movie
                </button>
                <button
                    className={currentView === 'actors' ? "active" : ""}
                    onClick={() => {
                        setSearchTerm("");
                        setCurrentView('actors');
                    }}>
                    <FontAwesomeIcon icon={faUserGroup}/> Actors
                </button>
                <button
                    className={currentView === 'add-actor' ? "active" : ""}
                    onClick={() => {
                        setSearchTerm("");
                        setCurrentView('add-actor');
                    }}>
                    <FontAwesomeIcon icon={faCirclePlus}/> Add Actors
                </button>
                <button
                    className="button-delete-all"
                    onClick={currentView === 'actors' ? deleteSelectedActors : deleteSelectedMovies}
                    disabled={currentView === 'actors' ? selectedActorIds.length === 0 : selectedMovieIds.length === 0}>
                    <FontAwesomeIcon icon={faTrashCan}/> Delete Selected ({currentView === 'actors' ? selectedActorIds.length : selectedMovieIds.length})
                </button>
            </div>

            <div className="panel-search">
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </nav>
    );
}