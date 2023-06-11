import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { Link } from "react-router-dom";
import '../style/projectCreation.css';

const CREATE_PROJECT_URL = '/create';

function ProjectCreation() {
    const nameRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, description])

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3500/create',
                JSON.stringify({ name, description }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(name, description);
            setSuccess(true);
            setName('');
            setDescription('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Failed to create new project');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="projectCreation--container">
            { success ? (
                <section className = "create--successful">
                    <h1>Successfully created a new project!</h1>
                    <p>
                        <span className="create--link">
                            <Link to="/">Home</Link>
                        </span>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Create Project</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Project Name:</label>
                        <input 
                            type="text"
                            id="name"
                            ref={nameRef}
                            autocomplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor="description">Project Description:</label>
                        <input 
                            type="text"
                            id="description"
                            autocomplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            required
                        />
                        <button>Create Project</button>
                    </form>
                </section>
            )}
            <div>{!success ? <Link to="/">Home Page</Link> : <></>}</div>
        </div>
    )
}

export default ProjectCreation