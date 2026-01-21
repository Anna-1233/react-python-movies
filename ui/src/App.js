import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };
        fetchMovies();
    }, []);

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
                setAddingMovie(false);
                toast.success(`Success: ${data.message}`);
            } else {
                // ROZBICIE BŁĘDÓW NA KONKRETNE KODY
                switch (response.status) {
                    case 409: // Conflict
                        toast.warning(`Conflict: ${data.detail}`);
                        break;
                    case 400: // Bad Request
                        toast.error(`Invalid data: ${data.detail}`);
                        break;
                    case 500: // Internal Server Error
                        toast.error("An unexpected server-side error occurred.", {
                            autoClose: 10000, // Ten toast będzie wisiał dłużej, bo błąd jest poważny
                        });
                        break;
                    default:
                        toast.error(`Error ${response.status}: ${data.detail || "Unexpected error"}`);
                }
            }
        } catch (e) {
            toast.error("Connection failed: Is your backend running?");
        }
    }

    async function handleDelMovie(movie) {
        const url = `/movies/${movie.id}`
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (response.ok) {
            setMovies(movies.filter(m => m !== movie))
        }
    }

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>

            {/* Ten komponent musi być tutaj raz – on zarządza wyświetlaniem toastów */}
            <ToastContainer position="top-left" autoClose={5000} />

            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={handleDelMovie}
                />}
            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}><FontAwesomeIcon icon={faCirclePlus} /> Go to add a movie</button>}
        </div>
    );
}

export default App;
