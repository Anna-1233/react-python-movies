import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faUser, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';

export default function MovieDetails({movieId, onBack}) {
    const [movie, setMovie] = useState(null);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);
            try {
                const [movieRes, actorsRes] = await Promise.all([
                    fetch(`/movies/${movieId}`),
                    fetch(`/movies/${movieId}/actors`)
                ]);

                if (movieRes.ok && actorsRes.ok) {
                    const movie = await movieRes.json();
                    const actors = await actorsRes.json();
                    setMovie(movie);
                    setActors(actors.actors);
                } else {
                    toast.error("Failed to load movie detail from server.");
                }
            } catch (e) {
                toast.error("Connection failed: Could not reach the server.");
            } finally {
                setLoading(false);
            }
        }
        fetchAllData();
    }, [movieId]);

    if (loading) {
        return (
            <div className="empty-state">
                <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
                <p>Loading movie data...</p>
            </div>
        );
    }

    return (
        <div className="movie-details-view">
            <button className="button button-outline" onClick={onBack}>
                <FontAwesomeIcon icon={faArrowLeft}/> Back to list
            </button>

            <div className="details-card">
                <h2>{movie?.title} ({movie?.year})</h2>
                <p><strong>Director:</strong> {movie?.director}</p>

                <div className="full-description">
                    <h3>Description</h3>
                    <p>{movie?.description}</p>
                </div>

                <div className="cast-section">
                    <h3>Cast</h3>
                    {actors.length > 0 ? (
                        <div className="actors-grid">
                            {actors.map(actor => (
                                <span key={actor.id}>
                                    <FontAwesomeIcon icon={faUser}/> {actor.name} {actor.surname}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="form-legend">No actors assigned to this movie yet. To add actor(s) back to List and edit movie.</p>
                    )}
                </div>
            </div>
        </div>
    );
}