import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faFilm, faUserGroup, faServer} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    // State:
    const [movies, setMovies] = useState([]);
    const [currentView, setCurrentView] = useState('movies')
    const [searchTerm, setSearchTerm] = useState("");
    const [editingMovie, setEditingMovie] = useState(null);

    // Funkcja otwierająca formularz w trybie edycji
    const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setCurrentView('add-movie'); // Przełączamy na widok formularza
};

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
                toast.error("Connection error: Is the backend running?");
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
                setCurrentView('movies');

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
                        toast.error("An unexpected server-side error occurred.", {
                        });
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error."}`);
                }
            }
        } catch (e) {
            toast.error("Connection failed: Could not reach the server.");
        }
    }

    // Delete movie
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
                        toast.error("An unexpected server-side error occurred.", {
                        });
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error"}`);
                }
            }
        } catch (e) {
            toast.error("Connection failed: Could not reach the server.");
        }
    }

    // Filter
    const filteredMovies = movies.filter(movie => {
    const title = movie.title ? movie.title.toLowerCase() : "";
    return title.includes(searchTerm.toLowerCase());
});

    return (
        <div>
            <header>
                <h1>My favourite movies to watch</h1>
            </header>
            {/* --- PANEL MANAGER (NAVBAR) --- */}
            <nav className="manager-panel">
                <div className="panel-brand"><FontAwesomeIcon icon={faServer}/> Movie Manager</div>

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
                        onClick={() => setCurrentView('add-actors')}>
                        <FontAwesomeIcon icon={faCirclePlus}/> Add Actors
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
                                            onEditMovie={handleEditMovie}
                                />
                            )}
                        </>
                    )}

                    {currentView === 'add-movie' && (
                        <MovieForm
                            onMovieSubmit={handleAddMovie}
                            onCancel={() => setCurrentView('movies')}
                            buttonLabel="Add new movie"
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
