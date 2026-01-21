import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import './MovieListItem.css';


export default function MovieListItem(props) {
    return (
        <div className="movie-card">
            <div className="movie-card-header">
                {/*: Left group: movies details */}
                <div className="movie-details">
                    <strong>{props.movie.title}</strong>
                    {' '}
                    <span>({props.movie.year})</span>
                    {' '}
                    directed by {props.movie.director}
                </div>

                {/* Right group: buttons */}
                <div className="movie-actions">
                    <button className="button" onClick={props.onEdit}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                    <button className="button button-outline" onClick={props.onDelete}><FontAwesomeIcon icon={faTrashCan} /> Delete</button>
                </div>
            </div>
            <div className="movie-card-description">
                {props.movie.description}
            </div>
        </div>
    );
}
