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

import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";


function App() {
    // States:
    const [currentView, setCurrentView] = useState('movies')
    const [searchTerm, setSearchTerm] = useState("");

    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedMovieIds, setSelectedMovieIds] = useState([]);

    const [actors, setActors] = useState([]);
    const [editingActor, setEditingActor] = useState(null);
    const [selectedActorIds, setSelectedActorIds] = useState([]);


    // Get movies list
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
            toast.error("Error updating movie.");
        }
    }

    // delete movie
    async function handleDelMovie(movie) {
        const confirmMessage = `Are you sure you want to delete a movie?`;
        if (window.confirm(confirmMessage)) {
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

    // Filter movies
    const filteredMovies = movies.filter(movie => {
        const title = movie.title ? movie.title.toLowerCase() : "";
        return title.includes(searchTerm.toLowerCase());
    });

    // ------------------ Actors ---------------------
    // get actors list
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

    // Add actor
    async function handleAddActor(actor) {
        try {
            const response = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify(actor),
                headers: {'Content-Type': 'application/json'}
            });

            const data = await response.json();

            if (response.ok) {
                actor.id = data.id;
                setActors([...actors, actor]);
                toast.success(`Success: ${data.message}`);
                setCurrentView('actors'); // back to actors list

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

    // for handleUpdateActor to save current actor in setEditingActor state
    function prepareEditActor(actor) {
        setEditingActor(actor);
        setCurrentView('add-actor');  // switch to ActorForm
    }

    // edit actor
    async function handleUpdateActor(actor) {
        try {
            const response = await fetch(`/actors/${editingActor.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...actor, id: editingActor.id})
            });

            const data = await response.json();

            if (response.ok) {

                const updatedActor = {...actor, id: editingActor.id};

                setActors(actors.map(m => m.id === editingActor.id ? updatedActor : m));
                toast.success("Actor updated!");
                setEditingActor(null); // clear setEditingActor state
                setCurrentView('actors'); // back to actors list
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
            toast.error("Error updating actor.");
        }
    }

    // delete actor
    async function handleDelActor(actor) {
        const confirmMessage = "Are you sure you want to delete an actor?";
        if (window.confirm(confirmMessage)) {
            try {
                const url = `/actors/${actor.id}`
                const response = await fetch(url, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (response.ok) {
                    setActors(actors.filter(m => m !== actor))
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
    }

    // for deleteSelectedActors to save selected ids
    function toggleActorSelection(actorId) {
        setSelectedActorIds(prev =>
            prev.includes(actorId)
                ? prev.filter(id => id !== actorId)
                : [...prev, actorId]
        );
    }

    // del selected actors
    async function deleteSelectedActors() {
        if (selectedActorIds.length === 0) return;

        const confirmMessage = `Are you sure you want to delete ${selectedActorIds.length} actor(s)?`;
        if (window.confirm(confirmMessage)) {
            try {
                const response = await fetch('/actors/batch', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(selectedActorIds)
                });

                const data = await response.json();

                if (response.ok) {
                    const deletedIds = data.deleted_ids || selectedActorIds;

                    setActors(prevActors =>
                        prevActors.filter(actor => !deletedIds.includes(actor.id))
                    );

                    setSelectedActorIds([]);
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

    // Filter actors
    const filteredActors = actors.filter(actor => {
        const fullName = `${actor.name} ${actor.surname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });


    return (
        <div>
            <header>
                <h1>My favourite movies to watch</h1>
            </header>
            {/* --- PANEL MANAGER (NAVBAR) --- */}
            <nav className="manager-panel">
                <div className="panel-brand">
                    <img src="/favicon.ico" alt="logo" style={{ width: '15px', marginRight: '10px' }} />
                    My Movies Manager
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
                        onClick={currentView === 'actors' ? deleteSelectedActors : deleteSelectedMovies}
                        disabled={currentView === 'actors' ? selectedActorIds.length === 0 : selectedMovieIds.length === 0}>
                        <FontAwesomeIcon icon={faTrashCan}/>
                        Delete Selected ({currentView === 'actors' ? selectedActorIds.length : selectedMovieIds.length})
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
                <ToastContainer position="top-left" autoClose={3000}/>

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
                            allActors={actors}
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
                                <ActorsList actors={filteredActors}
                                            onDeleteActor={handleDelActor}
                                            onEditActor={prepareEditActor}
                                            // onShowDetails={handleShowDetails}
                                            selectedIds={selectedActorIds}
                                            onToggleSelect={toggleActorSelection}
                                />
                            )}
                        </>
                    )}

                    {currentView === 'add-actor' && (
                        <ActorForm
                            key={editingActor ? editingActor.id : 'new'}
                            initialData={editingActor}
                            onActorSubmit={editingActor ? handleUpdateActor : handleAddActor}
                            onCancel={() => {
                                setCurrentView('actors');
                                setEditingMovie(null);
                            }}
                            buttonLabel={editingActor ? "Save changes" : "Add actor"}
                        />
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
