import {useState} from "react";
import {toast} from "react-toastify";
import './MovieForm.css';

export default function MovieForm(props) {
    const [title, setTitle] = useState(props.initialData?.title || '');
    const [year, setYear] = useState(props.initialData?.year ||'');
    const [director, setDirector] = useState(props.initialData?.director || '');
    const [description, setDescription] = useState(props.initialData?.description || '');
    const [errors, setErrors] = useState({});
    const [selectedActorIds, setSelectedActorIds] = useState(props.initialData?.actor_ids || []);

    const handleTitleChange = (event) => {
        const val = event.target.value;
        setTitle(val);

        if (val.trim() === "") {
            // puste pole
            setErrors(prev => ({...prev, title: "Title is required!"}));
        } else if (val.length < 3) {
            // za krótki tekst
            setErrors(prev => ({...prev, title: "Title too short (min. 3 characters)!"}));
        } else {
            // ok
            setErrors(prev => {
                const {title, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleYearChange = (event) => {
        const val = event.target.value;
        setYear(val);

        const yearNum = Number(val);
        const currentYear = new Date().getFullYear();

        if (val === "") {
            setErrors(prev => ({...prev, year: "Year is required!"}));
        } else if (yearNum < 1895 || yearNum > currentYear) {
            setErrors(prev => ({
                ...prev,
                year: `Year must be between 1895 and ${currentYear}`
            }));
        } else {
            setErrors(prev => {
                const {year, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleDirectorChange = (event) => {
        const val = event.target.value;
        setDirector(val);

        if (val.trim() === "") {
            setErrors(prev => ({...prev, director: "Director is required!"}));
        } else if (val.trim().length < 3) {
            setErrors(prev => ({...prev, director: "Director's name too short (min. 3 characters)!"}));
        } else {
            setErrors(prev => {
                const {director, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleActorToggle = (actorId) => {
        setSelectedActorIds(prev =>
            prev.includes(actorId)
                ? prev.filter(id => id !== actorId)
                : [...prev, actorId]
        );
    };

    function addMovie(event) {
        event.preventDefault();

        // check errors
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the errors before submitting!");
            return;
        }

        // check all required fields
        if (!title.trim() || !year || !director.trim()) {
            toast.error("All required fields must be filled!");

            // remove errors
            const newErrors = {};
            if (!title.trim()) newErrors.title = "Title is required!";
            if (!year) newErrors.year = "Year is required!";
            if (!director.trim()) newErrors.director = "Director is required!";
            setErrors(newErrors);
            return;
        }

        // all ok
        props.onMovieSubmit({title, year, director, description, actor_ids: selectedActorIds});
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setSelectedActorIds('');
        setErrors({});
    }

    return <form onSubmit={addMovie}>
        <h2>{props.initialData ? "Edit movie" : "Add movie"}</h2>
        <div>
            <label>Title<span className="required-star">*</span></label>
            {/*<input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>*/}
            <input type="text" value={title} onChange={handleTitleChange}/>
            {errors.title && <span className="error-text">{errors.title}</span>}
        </div>
        <div>
            <label>Year<span className="required-star">*</span></label>
            <input type="number" value={year} onChange={handleYearChange}/>
            {errors.year && <span className="error-text">{errors.year}</span>}
        </div>
        <div>
            <label>Director<span className="required-star">*</span></label>
            <input type="text" value={director} onChange={handleDirectorChange}/>
            {errors.director && <span className="error-text">{errors.director}</span>}
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <div>
            <label>Cast (Select actors)</label>
            <div className="actors-selection-list">
                {props.allActors.map(actor => (
                    <label key={actor.id} className="actor-checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedActorIds.includes(actor.id)}
                            onChange={() => handleActorToggle(actor.id)}
                        />
                        {actor.name} <strong>{actor.surname}</strong>
                    </label>
                ))}
            </div>
        </div>
        <p className="form-legend"><span className="required-star">*</span> Fields are required</p>
        <div className="form-actions">
            {/* submit button to send data to server / label add or edit depend on endpoint */}
            <button>{props.buttonLabel || 'Submit'}</button>

            {/* cancel button to go back to movies list */}
            <button type="button" className="button-outline" onClick={props.onCancel}>Cancel</button>
        </div>
    </form>;
}
