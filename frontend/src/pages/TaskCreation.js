// todo: date

import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
//import useAuth from '../hooks/useAuth';
import { Link, useParams } from "react-router-dom";
import Select from "react-select";

const ADD_TASK_URL = '/add';

function TaskCreation() {
    const axiosPrivate = useAxiosPrivate();
    //const { currUser } = useAuth();
    const { id } = useParams();

    const nameRef = useRef();
    const errRef = useRef();

    const [proj, setProj] = useState(id);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(''); 
    const [assign, setAssign] = useState(null);
    const [date, setDate] = useState(null);
    const [completed, setCompleted] = useState(false);

    const [userOptions, setUserOptions] = useState([]);
    //const [userData, setUserData] = useState([]);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const priorityOptions = [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
    ];

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, description])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getOptions = async userData => {
            try {
                let arr = [];
                for (let i = 0; i < userData.length; i++) {
                    let { data } = await axiosPrivate.get(`/users/${userData[i]}`);
                    arr.push({ value: data._id, label: data.username });
                }
                console.log(arr)
                setUserOptions(arr); 
            } catch (err) {
                console.log(err);
            }
        }

        const getUsers = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/projects",
                    {
                      signal: controller.signal,
                    }
                );
                const project = data.filter((item) => (item._id === id));
                if (isMounted) {
                    let arr = project[0].members;
                    arr.push(project[0].owner);
                    //setUserData(arr);
                    getOptions(arr);
                }
            } catch (err) {
                console.log(err);
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const response = await axios.post(ADD_TASK_URL,
                JSON.stringify({ proj, name, description, priority, assign, completed }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setSuccess(true);
            setProj(null);
            setName('');
            setDescription('');
            setAssign(null);
            setDate(null);
            setCompleted(false);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Failed to add new task');
            }
            errRef.current.focus();
        }
    }

    return (
        <div>
            { success ? (
                <section>
                    <h1>Successfully added a new task!</h1>
                    <p>
                        <span>
                            <Link to="/">Home</Link>
                        </span>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Add Task</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Task Name:</label>
                        <input 
                            type="text"
                            id="name"
                            ref={nameRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor="description">Task Description:</label>
                        <input 
                            type="text"
                            id="description"
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            required
                        />
                        <Select 
                            options={priorityOptions}
                            name="priority"
                            onChange={setPriority}
                            autoFocus={true}
                        />
                        <Select 
                            options={userOptions}
                            name="assignTo"
                            onChange={setAssign}
                            autoFocus={true}
                        />
                        <button type="submit">Add Task</button>
                    </form>
                </section>
            )}
        </div>
    )
}

export default TaskCreation