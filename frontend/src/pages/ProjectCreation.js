import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import Select from "react-select";
import '../style/projectCreation.css';

const CREATE_PROJECT_URL = '/create';

function ProjectCreation() {

    const axiosPrivate = useAxiosPrivate();
    const nameRef = useRef();
    const errRef = useRef();

    const [owner, setOwner] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([]);
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

    // useEffect(() => {
    //     const getOwner = async () => {
    //         try {
    //             const response = await axios.get(`/users/${}`);
    //             setOwner(response.data);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     getOwner();
    // }, [])

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
                const option = data.map((item)=>({
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

    // does this work?
    // const handleChange = selectedOption => {
    //     const getMember = async () => {
    //         try {
    //             //const response = await axios.get(`/users/${selectedOption.value}`);
    //             const { data } = await axiosPrivate.get(`/users/${selectedOption.value}`);
    //             //setMembers(oldArray => [...oldArray, data._id])
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getMember();
    // }

    const handleSubmit = async event => {
        event.preventDefault();

        console.log(selectedOptions.value)
        setMembers(oldArr => [...oldArr, "selectedOptions.value"]) // error here!
        console.log(members)

        try {
            const response = await axios.post('/create',
                JSON.stringify({ owner, name, description, members, completed }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setOwner(null);
            setName('');
            setDescription('');
            setMembers([]);
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
                            options={options}
                            name="members"
                            isSearchable
                            onChange={setSelectedOptions}
                            autoFocus={true}
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