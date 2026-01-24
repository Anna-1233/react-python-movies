import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserGroup} from '@fortawesome/free-solid-svg-icons';
import ActorListItem from "./ActorListItem";

export default function ActorsList(props) {

    const sortedActors = [...props.actors].sort((a, b) => a.surname.localeCompare(b.surname));

    return <div>
        <h2><FontAwesomeIcon icon={faUserGroup} /> Actors List</h2>
        <div className="actors-list">
            {sortedActors.map(actor => <ul key={actor.id}>
                <ActorListItem actor={actor}
                               // onDelete={() => props.onDeleteMovie(actor)}
                               onEdit={() => props.onEditActor(actor)}
                               // onShowDetails={props.onShowDetails}
                               // isSelected={props.selectedIds.includes(actor.id)}
                               // onToggleSelect={() => props.onToggleSelect(actor.id)}
                />
            </ul>)}
        </div>
    </div>;
}
