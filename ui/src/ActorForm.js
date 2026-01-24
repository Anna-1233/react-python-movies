import {useState} from "react";
import {toast} from "react-toastify";
import './MovieForm.css';

export default function ActorForm(props) {
    const [name, setName] = useState(props.initialData?.name || '');
    const [surname, setSurname] = useState(props.initialData?.surname ||'');
    const [errors, setErrors] = useState({});

    const handleNameChange = (event) => {
        const val = event.target.value;
        setName(val);

        if (val.trim() === "") {
            // puste pole
            setErrors(prev => ({...prev, name: "Name is required!"}));
        } else {
            // ok
            setErrors(prev => {
                const {name, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleSurnameChange = (event) => {
        const val = event.target.value;
        setSurname(val);

        if (val.trim() === "") {
            // puste pole
            setErrors(prev => ({...prev, surname: "Surname is required!"}));
        } else  {
            // ok
            setErrors(prev => {
                const {year, ...rest} = prev;
                return rest;
            });
        }
    };

    function addActor(event) {
        event.preventDefault();

        // check errors
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the errors before submitting!");
            return;
        }

        // check all required fields
        if (!name.trim() || !surname.trim()) {
            toast.error("All required fields must be filled!");

            // remove errors
            const newErrors = {};
            if (!name.trim()) newErrors.name = "Name is required!";
            if (!surname.trim()) newErrors.surname = "Surname is required!";
            setErrors(newErrors);
            return;
        }

        // all ok
        props.onActorSubmit({name, surname});
        setName('');
        setSurname('');
        setErrors({});
    }

    return <form onSubmit={addActor}>
        <h2>{props.initialData ? "Edit actor" : "Add actor"}</h2>
        <div>
            <label>Name<span className="required-star">*</span></label>
            <input type="text" value={name} onChange={handleNameChange}/>
            {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div>
            <label>Surname<span className="required-star">*</span></label>
            <input type="text" value={surname} onChange={handleSurnameChange}/>
            {errors.surname && <span className="error-text">{errors.surname}</span>}
        </div>
        <p className="form-legend"><span className="required-star">*</span> Fields are required</p>
        <div className="form-actions">
            {/* submit button to send data to server / label add or edit depend on endpoint */}
            <button>{props.buttonLabel || 'Submit'}</button>

            {/* cancel button to go back to actor list */}
            <button type="button" className="button-outline" onClick={props.onCancel}>Cancel</button>
        </div>
    </form>;
}
