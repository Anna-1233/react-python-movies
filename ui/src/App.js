import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlus, faFilm, faUserGroup, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import MovieDetails from "./MovieDetails";

import ActorsList from "./ActorsList";

function App() {
    // State:
    const [movies, setMovies] = useState([]);
    const [currentView, setCurrentView] = useState('movies')
    const [searchTerm, setSearchTerm] = useState("");
    const [editingMovie, setEditingMovie] = useState(null);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovieIds, setSelectedMovieIds] = useState([]);

    const [actors, setActors] = useState([]);


    // Get movie list
    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await fetch('/movies');
                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    toast.error("Failed to load movies from server.");
                }
            } catch (e) {
                toast.error("Connection failed: Could not reach the server.");
            }
        }

        fetchMovies();
    }, []);

    // Add movie
    async function handleAddMovie(movie) {
        try {
            const response = await fetch('/movies', {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: {'Content-Type': 'application/json'}
            });

            const data = await response.json();

            if (response.ok) {
                movie.id = data.id;
                setMovies([...movies, movie]);
                toast.success(`Success: ${data.message}`);
                setCurrentView('movies'); // back to list

            } else {
                // errors handling based on backend
                switch (response.status) {
                    case 409: // Conflict
                        toast.warning(`Conflict: ${data.detail}`);
                        break;
                    case 400: // Bad Request
                        toast.error(`Invalid data: ${data.detail}`);
                        break;
                    case 500: // Internal Server Error
                        toast.error("An unexpected server-side error occurred.", {});
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error."}`);
                }
            }
        } catch (e) {
            toast.error("Connection failed: Could not reach the server.");
        }
    }

    // for handleUpdateMovie to save current movie in setEditingMovie state
    function prepareEdit(movie) {
        setEditingMovie(movie);
        setCurrentView('add-movie');  // switch to MovieForm
    }

    // edit movie
    async function handleUpdateMovie(movie) {
        try {
            const response = await fetch(`/movies/${editingMovie.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...movie, id: editingMovie.id})
            });

            const data = await response.json();

            if (response.ok) {
                const updatedMovie = {...movie, id: editingMovie.id};

                setMovies(movies.map(m => m.id === editingMovie.id ? updatedMovie : m));
                toast.success("Movie updated!");
                setEditingMovie(null); // clear setEditingMovie state
                setCurrentView('movies'); // back to list
            } else {
                // errors handling based on backend
                switch (response.status) {
                    case 409: // Conflict
                        toast.warning(`Conflict: ${data.detail}`);
                        break;
                    case 400: // Bad Request
                        toast.error(`Invalid data: ${data.detail}`);
                        break;
                    case 500: // Internal Server Error
                        toast.error("An unexpected server-side error occurred.", {});
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error."}`);
                }
            }
        } catch (e) {
            toast.error("Error updating movie");
        }
    }

    // delete movie
    async function handleDelMovie(movie) {
        try {
            const url = `/movies/${movie.id}`
            const response = await fetch(url, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setMovies(movies.filter(m => m !== movie))
                toast.success(`Success: ${data.message}`);
            } else {
                // errors handling based on backend
                switch (response.status) {
                    case 404: // Not found
                        toast.error(`Error: ${data.detail}`);
                        break;
                    case 500: // Internal Server Error
                        toast.error("An unexpected server-side error occurred.", {});
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error"}`);
                }
            }
        } catch (e) {
            toast.error("Connection failed: Could not reach the server.");
        }
    }

    // get specific movie
    function handleShowDetails(id) {
        setSelectedMovieId(id);
        setCurrentView('movie-details');

    }

    // for deleteSelectedMovies to save selected ids
    function toggleMovieSelection(movieId) {
        setSelectedMovieIds(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    }

    // del selected movies
    async function deleteSelectedMovies() {
        if (selectedMovieIds.length === 0) return;

        const confirmMessage = `Are you sure you want to delete ${selectedMovieIds.length} movie(s)?`;
        if (window.confirm(confirmMessage)) {
            try {
                const response = await fetch('/movies/batch', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(selectedMovieIds)
                });

                const data = await response.json();

                if (response.ok) {
                    const deletedIds = data.deleted_ids || selectedMovieIds;

                    setMovies(prevMovies =>
                        prevMovies.filter(movie => !deletedIds.includes(movie.id))
                    );

                    setSelectedMovieIds([]);
                    toast.success(`Success: ${data.message}`);
                } else {
                    // errors handling based on backend
                    switch (response.status) {
                        case 500: // Internal Server Error
                            toast.error("An unexpected server-side error occurred.", {});
                        break;
                        default:
                        toast.error(`Error ${response.status}: ${data.detail || "Error during batch delete."}`);
                    }
                }
            } catch (e) {
                toast.error("Connection failed: Could not delete movies.");
            }
        }
    }

    // Filter
    const filteredMovies = movies.filter(movie => {
        const title = movie.title ? movie.title.toLowerCase() : "";
        return title.includes(searchTerm.toLowerCase());
    });

    // get actors
    useEffect(() => {
        async function fetchActors() {
            try {
                const response = await fetch('/actors');
                if (response.ok) {
                    const data = await response.json();
                    setActors(data);
                } else {
                    toast.error("Failed to load actors from server.");
                }
            } catch (e) {
                toast.error("Connection failed: Could not reach the server.");
            }
        }

        fetchActors();
    }, []);


    return (
        <div>
            <header>
                <h1>My favourite movies to watch</h1>
            </header>
            {/* --- PANEL MANAGER (NAVBAR) --- */}
            <nav className="manager-panel">
                <div className="panel-brand">
                    <img src="/favicon.ico" alt="logo" style={{ width: '15px', marginRight: '10px' }} />
                    {/*<FontAwesomeIcon icon={faServer}/>*/}
                    My Movies Manager
                    {/*<div><img src="/favicon.ico" alt="logo" style={{ width: '15px', marginRight: '10px' }} /></div>*/}
                    {/*<div>*/}
                    {/*    {new Date().toLocaleDateString('pl-PL')}*/}
                    {/*</div>*/}
                </div>
                <div className="panel-actions">
                    <button
                        className={currentView === 'movies' ? "active" : ""}
                        onClick={() => setCurrentView('movies')}>
                        <FontAwesomeIcon icon={faFilm}/> Movies
                    </button>
                    <button
                        className={currentView === 'add-movie' ? "active" : ""}
                        onClick={() => setCurrentView('add-movie')}>
                        <FontAwesomeIcon icon={faCirclePlus}/> Add Movie
                    </button>
                    <button
                        className={currentView === 'actors' ? "active" : ""}
                        onClick={() => setCurrentView('actors')}>
                        <FontAwesomeIcon icon={faUserGroup}/> Actors
                    </button>
                    <button
                        className={currentView === 'add-actor' ? "active" : ""}
                        onClick={() => setCurrentView('add-actor')}>
                        <FontAwesomeIcon icon={faCirclePlus}/> Add Actors
                    </button>
                    <button
                        className="button-delete-all"
                        onClick={deleteSelectedMovies}
                        disabled={selectedMovieIds.length === 0}>
                        <FontAwesomeIcon icon={faTrashCan}/> Delete Selected ({selectedMovieIds.length})
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

            <div className="container">
                {/* --- Toast managing --- */}
                <ToastContainer position="top-left" autoClose={5000}/>

                {/* --- MAIN PAGE (depends on currentView State) --- */}
                <main className="content">
                    {currentView === 'movies' && (
                        <>
                            {movies.length === 0 ? (
                                <div className="empty-state">
                                    <p>No movies yet. Maybe add something?</p>
                                    <button onClick={() => setCurrentView('add-movie')}>Add your first movie!</button>
                                </div>
                            ) : (
                                <MoviesList movies={filteredMovies}
                                            onDeleteMovie={handleDelMovie}
                                            onEditMovie={prepareEdit}
                                            onShowDetails={handleShowDetails}
                                            selectedIds={selectedMovieIds}
                                            onToggleSelect={toggleMovieSelection}
                                />
                            )}
                        </>
                    )}

                    {currentView === 'add-movie' && (
                        <MovieForm
                            key={editingMovie ? editingMovie.id : 'new'}
                            initialData={editingMovie}
                            onMovieSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
                            onCancel={() => {
                                setCurrentView('movies');
                                setEditingMovie(null);
                            }}
                            buttonLabel={editingMovie ? "Save changes" : "Add movie"}
                        />
                    )}

                    {currentView === 'movie-details' && (
                        <MovieDetails
                            movieId={selectedMovieId}
                            onBack={() => {
                                setCurrentView('movies');
                                setSelectedMovieId(null);
                            }}
                        />
                    )}

                    {currentView === 'actors' && (
                        <>
                            {actors.length === 0 ? (
                                <div className="empty-state">
                                    <p>No actors yet. Maybe add someone?</p>
                                    <button onClick={() => setCurrentView('add-actor')}>Add first actor!</button>
                                </div>
                            ) : (
                                <ActorsList actors={actors}
                                            // onDeleteMovie={handleDelMovie}
                                            // onEditMovie={prepareEdit}
                                            // onShowDetails={handleShowDetails}
                                            // selectedIds={selectedMovieIds}
                                            // onToggleSelect={toggleMovieSelection}
                                />
                            )}
                        </>
                    )}

                </main>
            </div>
            <footer>
                <p>&copy; My Movie Database. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
