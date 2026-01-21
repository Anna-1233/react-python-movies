import {useState} from "react";
import {toast} from "react-toastify";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    const handleTitleChange = (event) => {
        const val = event.target.value;
        setTitle(val);

        if (val.trim() === "") {
            // 1. Reakcja na puste pole (zanim zaczniesz pisać lub po skasowaniu wszystkiego)
            setErrors(prev => ({...prev, title: "Title is required!"}));
        } else if (val.length < 3) {
            // 2. Reakcja na za krótki tekst
            setErrors(prev => ({...prev, title: "Title too short (min. 3 characters)!"}));
        } else {
            // 3. Jeśli wszystko ok - usuwamy błąd
            setErrors(prev => {
                const {title, ...rest} = prev;
                return rest;
            });
        }
    };

    const handleYearChange = (event) => {
        const val = event.target.value;
        setYear(val); // Nadal trzymamy w stanie tekst, żeby input działał płynnie

        const yearNum = Number(val);
        const currentYear = new Date().getFullYear(); // Dynamicznie pobiera 2026

        if (val === "") {
            setErrors(prev => ({...prev, year: "Year is required!"}));
        } else if (yearNum < 1895 || yearNum > currentYear) {
            setErrors(prev => ({
                ...prev,
                year: `Year must be between 1895 and ${currentYear}`
            }));
        } else {
            // Jeśli wszystko ok, usuwamy błąd roku
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

    function addMovie(event) {
        event.preventDefault();

        // 1. Sprawdzamy czy w stanie 'errors' są jakiekolwiek komunikaty
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the errors before submitting!");
            return;
        }

        // 2. Ostateczne sprawdzenie czy pola nie są puste (na wypadek kliknięcia bez wpisywania niczego)
        if (!title.trim() || !year || !director.trim()) {
            toast.error("All required fields must be filled!");

            // Ustawiamy błędy wizualne dla pustych pól
            const newErrors = {};
            if (!title.trim()) newErrors.title = "Title is required!";
            if (!year) newErrors.year = "Year is required!";
            if (!director.trim()) newErrors.director = "Director is required!";
            setErrors(newErrors);
            return;
        }

        // 3. Jeśli wszystko OK, wysyłamy dane
        props.onMovieSubmit({title, year, director, description});
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setErrors({});
    }

    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
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
        <p className="form-legend"><span className="required-star">*</span> Fields are required</p>
        {/* przycisk do wysłania danych na serwer / napis w zależności czy add czy edit */}
        <button>{props.buttonLabel || 'Submit'}</button>
        {/* Przycisk anulowania typu "button", żeby nie wysłał formularza! */}

        <button type="button" className="button-outline" onClick={props.onCancel}>Cancel</button>
    </form>;
}
