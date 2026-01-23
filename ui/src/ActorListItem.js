import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import './ActorListItem.css';

export default function ActorListItem(props) {
    return (
        <div className="actor-card">
            <div className="actor-info">
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={props.onToggleSelect}
                />
                {' '}
                <span className="actor-name">
                    {props.actor.name} <strong>{props.actor.surname}</strong>
                </span>
            </div>
            <div className="actor-actions">
                <a onClick={props.onEdit}><FontAwesomeIcon icon={faPenToSquare}/>Edit</a>
                <a onClick={props.onDelete}><FontAwesomeIcon icon={faTrashCan}/>Delete</a>
            </div>
        </div>
    );
}
