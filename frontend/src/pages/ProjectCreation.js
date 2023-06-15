import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import { Link } from "react-router-dom";
import Select from "react-select";
import '../style/projectCreation.css';

const CREATE_PROJECT_URL = '/create';

function ProjectCreation() {
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();

    const nameRef = useRef();
    const errRef = useRef();

    const [own, setOwn] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //const [memb, setMemb] = useState([]);
    const memb = [];
    const [completed, setCompleted] = useState(false);

    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(null);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, description])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getOwner = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/users",
                    {
                      signal: controller.signal,
                    }
                );
                const currentUser = data.filter((item) => (item.username === currUser));
                setOwn(currentUser[0]._id);
            } catch (err) {
                console.log(err);
            }
        };

        getOwner();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/users",
                    {
                      signal: controller.signal,
                    }
                );
                const option = data.map((item) => ({ // todo: filter out owner
                    "value" : item._id,
                    "label" : item.username
                }))
                setOptions(option);
            } catch (err) {
                console.log(err);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate])

    const handleSubmit = async event => {
        event.preventDefault();

        //const arr = [];
        for (let i = 0; i < selectedOptions.length; i++) {
            let { data } = await axiosPrivate.get(`/users/${selectedOptions[i].value}`);
            //arr.push(data._id);
            memb.push(data._id);
        }
        //setMemb(arr);

        try {
            const response = await axios.post(CREATE_PROJECT_URL,
                JSON.stringify({ own, name, description, memb, completed }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setOwn(null);
            setName('');
            setDescription('');
            //setMemb([]);
            setCompleted(false);
            setSelectedOptions(null);
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
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor="description">Project Description:</label>
                        <input 
                            type="text"
                            id="description"
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            required
                        />
                        <Select 
                            className="projectCreation--select"
                            options={options}
                            name="members"
                            isMulti
                            isSearchable
                            onChange={setSelectedOptions}
                            autoFocus={true}
                        />
                        <button type="submit">Create Project</button>
                    </form>
                </section>
            )}
            <div>{!success ? <Link to="/">Home Page</Link> : <></>}</div>
        </div>
    )
}

export default ProjectCreation