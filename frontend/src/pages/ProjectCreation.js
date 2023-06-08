import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";

const CREATE_PROJECT_URL = '/create';

function ProjectCreation() {
    const nameRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);

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
            const response = await axios.post(CREATE_PROJECT_URL,
                JSON.stringify({ name, description, completed }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setName('');
            setDescription('');
            setCompleted(false);
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
        <>
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
        </>
    )
}

export default ProjectCreation