import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import { Link } from "react-router-dom";
import Select from "react-select";
import '../style/projectCreation.css';
import { useNavigate} from 'react-router-dom';

const CREATE_PROJECT_URL = '/create';

function ProjectCreation() {
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();
    const navigate = useNavigate();

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
                if (isMounted) {
                    setOwn(currentUser[0]._id);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getOwner();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

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
                const newData = data.filter((item) => (item.username !== currUser));
                const option = newData.map((item) => ({ 
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
    }, [])

    const handleSubmit = async event => {
        event.preventDefault();

        //const arr = [];
        for (let i = 0; i < selectedOptions?.length; i++) {
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
            // create new chat when a new project is created
            // const res = await axios.post('/chats',
            //     JSON.stringify({ own, memb }),
            //     {
            //         headers: { 'Content-Type': 'application/json' }
            //     }
            // );
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
                navigate("/", { replace: true })
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='blueHeader'>Create Project</h1>
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
                            placeholder = 'Add members'
                            required
                        />
                        <button type="submit" className='createProject'>Create Project</button>
                    </form>
                </section>
            )}
            <div>{!success ? <Link to="/"><span style={{color: '#6988F6', textDecoration: 'underline'}}>Home Page</span></Link> : <></>}</div>
        </div>
    )
}

export default ProjectCreation