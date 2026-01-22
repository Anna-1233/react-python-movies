import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2><FontAwesomeIcon icon={faClapperboard} /> Movies</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.id}>
                <MovieListItem movie={movie}
                               onDelete={() => props.onDeleteMovie(movie)}
                               onEdit={() => props.onEditMovie(movie)}
                               onShowDetails={props.onShowDetails}
                               isSelected={props.selectedIds.includes(movie.id)}
                               onToggleSelect={() => props.onToggleSelect(movie.id)}
                />
            </li>)}
        </ul>
    </div>;
}
